//! Извлечение доминирующего цвета и HSL-сортировка фотографий.

use std::path::Path;

/// Извлекает доминирующий цвет фото — усредняет пиксели уменьшенной копии 64×64.
/// Принимает путь к оригиналу или к миниатюре.
pub fn extract_dominant_color(path: &Path) -> Result<[u8; 3], String> {
    let img = image::open(path)
        .map_err(|e| format!("Не удалось открыть {}: {e}", path.display()))?
        .thumbnail(64, 64)
        .into_rgb8();

    let n = img.width() as u64 * img.height() as u64;
    if n == 0 {
        return Err("Изображение пустое".to_string());
    }

    let (r, g, b) = img.pixels().fold((0u64, 0u64, 0u64), |(r, g, b), p| {
        (r + p[0] as u64, g + p[1] as u64, b + p[2] as u64)
    });

    Ok([(r / n) as u8, (g / n) as u8, (b / n) as u8])
}

/// Преобразует RGB [0–255] в HSL (H: 0–360, S: 0–1, L: 0–1).
pub fn rgb_to_hsl(rgb: [u8; 3]) -> (f32, f32, f32) {
    let r = rgb[0] as f32 / 255.0;
    let g = rgb[1] as f32 / 255.0;
    let b = rgb[2] as f32 / 255.0;

    let max = r.max(g).max(b);
    let min = r.min(g).min(b);
    let delta = max - min;

    let l = (max + min) / 2.0;

    let s = if delta < f32::EPSILON {
        0.0
    } else {
        delta / (1.0 - (2.0 * l - 1.0).abs())
    };

    let h = if delta < f32::EPSILON {
        0.0
    } else if (max - r).abs() < f32::EPSILON {
        let sector = ((g - b) / delta) % 6.0;
        // Корректируем отрицательные значения
        60.0 * if sector < 0.0 { sector + 6.0 } else { sector }
    } else if (max - g).abs() < f32::EPSILON {
        60.0 * ((b - r) / delta + 2.0)
    } else {
        60.0 * ((r - g) / delta + 4.0)
    };

    (h, s, l)
}

/// Сортирует пары (id, цвет) по HSL-градиенту: H → S → L.
/// Возвращает отсортированный список id.
pub fn sort_by_hsl(photos: &[(String, [u8; 3])]) -> Vec<String> {
    let mut indexed: Vec<(f32, f32, f32, &str)> = photos
        .iter()
        .map(|(id, color)| {
            let (h, s, l) = rgb_to_hsl(*color);
            (h, s, l, id.as_str())
        })
        .collect();

    indexed.sort_by(|a, b| {
        a.0.partial_cmp(&b.0)
            .unwrap_or(std::cmp::Ordering::Equal)
            .then(a.1.partial_cmp(&b.1).unwrap_or(std::cmp::Ordering::Equal))
            .then(a.2.partial_cmp(&b.2).unwrap_or(std::cmp::Ordering::Equal))
    });

    indexed
        .into_iter()
        .map(|(_, _, _, id)| id.to_string())
        .collect()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn rgb_to_hsl_red() {
        let (h, s, l) = rgb_to_hsl([255, 0, 0]);
        assert!((h - 0.0).abs() < 1.0, "hue of red should be ~0, got {h}");
        assert!(s > 0.9, "saturation of red should be ~1, got {s}");
        assert!(
            (l - 0.5).abs() < 0.01,
            "lightness of red should be ~0.5, got {l}"
        );
    }

    #[test]
    fn rgb_to_hsl_green() {
        let (h, s, _) = rgb_to_hsl([0, 255, 0]);
        assert!(
            (h - 120.0).abs() < 1.0,
            "hue of green should be ~120, got {h}"
        );
        assert!(s > 0.9);
    }

    #[test]
    fn rgb_to_hsl_blue() {
        let (h, s, _) = rgb_to_hsl([0, 0, 255]);
        assert!(
            (h - 240.0).abs() < 1.0,
            "hue of blue should be ~240, got {h}"
        );
        assert!(s > 0.9);
    }

    #[test]
    fn rgb_to_hsl_gray_zero_saturation() {
        let (_, s, l) = rgb_to_hsl([128, 128, 128]);
        assert!(s < 0.01, "grey has zero saturation, got {s}");
        assert!((l - 0.502).abs() < 0.01, "grey lightness ~0.5, got {l}");
    }

    #[test]
    fn rgb_to_hsl_black() {
        let (h, s, l) = rgb_to_hsl([0, 0, 0]);
        assert_eq!(h, 0.0);
        assert_eq!(s, 0.0);
        assert_eq!(l, 0.0);
    }

    #[test]
    fn rgb_to_hsl_white() {
        let (_, _, l) = rgb_to_hsl([255, 255, 255]);
        assert!((l - 1.0).abs() < 0.01);
    }

    #[test]
    fn sort_by_hsl_orders_by_hue() {
        // Blue (240°) should come after Red (0°) and Green (120°)
        let photos = vec![
            ("blue".to_string(), [0u8, 0, 255]),
            ("red".to_string(), [255, 0, 0]),
            ("green".to_string(), [0, 255, 0]),
        ];
        let sorted = sort_by_hsl(&photos);
        assert_eq!(sorted, vec!["red", "green", "blue"]);
    }

    #[test]
    fn sort_by_hsl_stable_on_greys() {
        // All greys have hue=0, so order is defined by saturation then lightness
        let photos = vec![
            ("dark".to_string(), [64u8, 64, 64]),
            ("light".to_string(), [192, 192, 192]),
        ];
        let sorted = sort_by_hsl(&photos);
        // Both have S=0, so sorted by L: dark (lower L) first
        assert_eq!(sorted[0], "dark");
        assert_eq!(sorted[1], "light");
    }

    #[test]
    fn sort_by_hsl_empty() {
        let sorted = sort_by_hsl(&[]);
        assert!(sorted.is_empty());
    }
}
