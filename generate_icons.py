import os
from PIL import Image, ImageDraw

icons_dir = r"D:\coding\personal\TransLLM\icons"
os.makedirs(icons_dir, exist_ok=True)

for size in [16, 48, 128]:
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Background rounded rect
    radius = max(2, int(size * 0.22))
    draw.rounded_rectangle([0, 0, size - 1, size - 1], radius=radius, fill=(14, 165, 233, 255))
    
    # Inner ring
    margin = max(1, int(size * 0.12))
    ring_w = max(1, int(size * 0.05))
    draw.ellipse([margin, margin, size - margin - 1, size - margin - 1], outline=(255, 255, 255, 120), width=ring_w)
    
    # "T" Letter
    tx1, tx2 = int(size * 0.25), int(size * 0.75)
    ty = int(size * 0.28)
    bar_w = max(1, int(size * 0.12))
    
    # Top bar
    draw.line([tx1, ty, tx2, ty], fill=(255, 255, 255, 255), width=bar_w)
    # Stem
    mid_x = int(size * 0.5)
    by2 = int(size * 0.74)
    draw.line([mid_x, ty, mid_x, by2], fill=(255, 255, 255, 255), width=bar_w)
    
    target = os.path.join(icons_dir, f"icon{size}.png")
    img.save(target, "PNG")
    print(f"Generated: {target} ({size}x{size})")
