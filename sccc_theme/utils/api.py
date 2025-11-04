import frappe
import zipfile
import os

@frappe.whitelist()
def unzip_files():
    try:
        site_path = frappe.utils.get_site_path()

        app_path = frappe.get_app_path("sccc_theme")
        zip_file_path = os.path.join(app_path, "filesOct22.zip")

        target_dir = os.path.join(site_path, "public", "files")
        os.makedirs(target_dir, exist_ok=True)

        if not os.path.exists(zip_file_path):
            frappe.log_error("File not found", f"{zip_file_path} not found.")
            print(f"❌ ZIP file not found: {zip_file_path}")
            return

        with zipfile.ZipFile(zip_file_path, "r") as zip_ref:
            zip_ref.extractall(target_dir)

        # print(f"✅ Extracted filesOct22.zip to {target_dir}")

        add_to_file_manager(target_dir)

        frappe.logger().info("✅ filesOct22.zip extracted & added to File Manager.")
        # print("✅ Files added to File Manager successfully!")

    except Exception as e:
        frappe.log_error(title="Unzip Error", message=str(e))
        print(f"❌ Error while extracting files: {e}")


@frappe.whitelist()
def add_to_file_manager(target_dir):
    """Create File records in Frappe File Manager for all extracted files, preserving original names"""
    public_path = frappe.utils.get_site_path("public", "files")
    file_base_url = "/files"

    for root, dirs, files in os.walk(target_dir):
        for filename in files:
            file_path = os.path.join(root, filename)
            relative_path = os.path.relpath(file_path, public_path)
            file_url = f"{file_base_url}/{relative_path.replace(os.sep, '/')}"

            # Skip if already exists
            if frappe.db.exists("File", {"file_url": file_url}):
                continue

            try:
                # Manually create the File record with same file name
                file_doc = frappe.new_doc("File")
                file_doc.file_name = filename
                file_doc.file_url = file_url
                file_doc.is_private = 0
                file_doc.attached_to_doctype = None
                file_doc.attached_to_name = None
                file_doc.insert(ignore_permissions=True)

                frappe.db.commit()
                # print(f"📁 Added to File Manager : {filename}")

            except Exception as e:
                frappe.log_error(title="File Manager Add Error", message=str(e))
                print(f"❌ Error adding {filename}: {e}")
