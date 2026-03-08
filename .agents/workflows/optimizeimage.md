---
description: You are a agent running the image optimization tool.
---

You are a agent and you are a image optimization tool. If i tell you to optimize images with no more instructions do not delete the old images, create copies using your best judgement on performance. You should ask before updating code references, deleting the old images, and should use quality 90 as the standard quality. Here is the tool you are allowed to create or use if it exists optimize_images.py, "import os
import argparse
from PIL import Image

def optimize_images(directory, project_root, max_width=1920, quality=80, delete_originals=False):
    """
    Scans a directory for images (jpg, jpeg, png), resizes, and converts to WebP.
    """
    if not os.path.exists(directory):
        print(f"Error: Directory '{directory}' does not exist.")
        return

    print(f"\n--- Starting Optimization in: {os.path.abspath(directory)} ---")
    
    count = 0
    total_saved = 0.0
    mappings = []

    # Image extensions to search for
    target_extensions = ('.png', '.jpg', '.jpeg')

    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.lower().endswith(target_extensions):
                file_path = os.path.join(root, file)
                
                try:
                    # Open the image
                    with Image.open(file_path) as img:
                        original_size = os.path.getsize(file_path) / 1024  # KB
                        
                        # Resize if too wide
                        if img.width > max_width:
                            w_p = (max_width / float(img.width))
                            h_size = int((float(img.height) * float(w_p)))
                            img = img.resize((max_width, h_size), Image.Resampling.LANCZOS)
                        
                        # Save as optimized WebP
                        webp_path = os.path.splitext(file_path)[0] + ".webp"
                        if os.path.exists(webp_path):
                            print(f"Replacing existing: {os.path.basename(webp_path)}")
                        
                        img.save(webp_path, "WEBP", quality=quality, optimize=True)
                        
                        new_size = os.path.getsize(webp_path) / 1024  # KB
                        savings = (original_size - new_size)
                        total_saved += savings
                        count += 1
                        
                        # Store mapping with relative path from project root
                        # Normalize slashes to forward slashes for web compatibility
                        rel_old = os.path.relpath(file_path, project_root).replace('\\', '/')
                        rel_new = os.path.relpath(webp_path, project_root).replace('\\', '/')
                        mappings.append((rel_old, rel_new))
                        
                        # Also keep filename-only mapping as a fallback (optional)
                        # mappings.append((file, os.path.basename(webp_path)))
                        
                        print(f"Optimized: {file}")
                        print(f"  - Original: {original_size:.1f}KB")
                        print(f"  - New WebP: {new_size:.1f}KB ({ (new_size/original_size)*100:.1f}% of original)")
                        print(f"  - Saved: {savings:.1f}KB\n")

                        # Optional Cleanup
                        if delete_originals:
                            os.remove(file_path)
                            print(f"  - Deleted original: {file}")

                except Exception as e:
                    print(f"Error processing {file}: {e}")

    print(f"--- Optimization Complete! ---")
    print(f"Processed {count} images.")
    print(f"Total Disk Space Saved: {max(0.0, total_saved)/1024:.2f}MB\n")
    
    return mappings

def update_code_references(mappings, project_root):
    """
    Scans project files and replaces image path references.
    """
    if not mappings:
        return

    print(f"--- Updating Code References in: {os.path.abspath(project_root)} ---")
    
    # Extensions to search in
    code_extensions = ('.html', '.css', '.js')
    excluded_dirs = {'.git', 'node_modules', '__pycache__', '.agents', '.agent', '_agents', '_agent'}

    files_modified = 0
    total_replacements = 0

    for root, dirs, files in os.walk(project_root):
        # Skip excluded directories
        dirs[:] = [d for d in dirs if d not in excluded_dirs]
        
        for file in files:
            if file.lower().endswith(code_extensions):
                file_path = os.path.join(root, file)
                
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    new_content = content
                    file_replacements = 0
                    
                    for old_path, new_path in mappings:
                        # Try replacing both normalized variants to handle ./ 
                        # This catches src="Images/..." and src="./Images/..."
                        variants = [old_path, f"./{old_path}"]
                        target_new = new_path
                        
                        for variant in variants:
                            if variant in new_content:
                                count = new_content.count(variant)
                                new_content = new_content.replace(variant, target_new)
                                file_replacements += count
                    
                    if file_replacements > 0:
                        with open(file_path, 'w', encoding='utf-8') as f:
                            f.write(new_content)
                        print(f"Updated {file}: {file_replacements} replacements.")
                        files_modified += 1
                        total_replacements += file_replacements
                        
                except Exception as e:
                    print(f"Error updating references in {file}: {e}")

    print(f"--- Code Update Complete! ---")
    print(f"Modified {files_modified} files with {total_replacements} total replacements.\n")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Optimize images (resize and convert to WebP) and update code references.")
    parser.add_argument("folder", nargs="?", default="./Images", help="Folder to optimize (default: ./Images)")
    parser.add_argument("--delete", action="store_true", help="Delete original files after optimization")
    parser.add_argument("--quality", type=int, default=80, help="WebP quality (default: 80)")
    parser.add_argument("--width", type=int, default=1920, help="Max image width (default: 1920)")
    parser.add_argument("--replace-code", action="store_true", help="Search and replace image references in HTML/CSS/JS files")
    parser.add_argument("--root", default=".", help="Project root directory (default: current directory)")

    args = parser.parse_args()
    
    # Ensure root is absolute to avoid relative path confusion
    project_root = os.path.abspath(args.root)

    mappings = optimize_images(args.folder, project_root, args.width, args.quality, args.delete)
    
    if args.replace_code:
        update_code_references(mappings, project_root)
"