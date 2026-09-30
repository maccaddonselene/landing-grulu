from PIL import Image, ImageDraw
import sys

def add_rounded_corners(im, rad):
    circle = Image.new('L', (rad * 2, rad * 2), 0)
    draw = ImageDraw.Draw(circle)
    draw.ellipse((0, 0, rad * 2 - 1, rad * 2 - 1), fill=255)
    
    alpha = Image.new('L', im.size, 255)
    w, h = im.size
    
    # Paste the corners
    alpha.paste(circle.crop((0, 0, rad, rad)), (0, 0))
    alpha.paste(circle.crop((rad, 0, rad * 2, rad)), (w - rad, 0))
    alpha.paste(circle.crop((0, rad, rad, rad * 2)), (0, h - rad))
    alpha.paste(circle.crop((rad, rad, rad * 2, rad * 2)), (w - rad, h - rad))
    
    im.putalpha(alpha)
    return im

try:
    img_path = 'assets/logo-grulu-light.png'
    im = Image.open(img_path).convert("RGBA")
    
    # 22% radius for a modern smooth rounded square (iOS style)
    rad = int(min(im.size) * 0.22)
    
    im_rounded = add_rounded_corners(im, rad)
    im_rounded.save(img_path, 'PNG')
    print("Done rounding corners.")
except Exception as e:
    print(f"Error: {e}")
