tinymce.init({
  selector: 'textarea.tinymce',
  skin: 'oxide-dark',          // 👈 giao diện dark
  content_css: 'dark',  
  height: 500,

  plugins: 'lists link image table code help wordcount',
  toolbar: 'undo redo | bold italic | bullist numlist | image link | code',

  license_key: 'gpl',

  // 👉 vẫn giữ chọn file
  file_picker_types: 'image',
  file_picker_callback: function (cb, value, meta) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    input.onchange = async function () {
      const file = this.files[0];

      // 👉 upload lên server
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch("/admin/upload", {
        method: "POST",
        body: formData
      });

      const data = await res.json();

      // 👉 trả URL thật
      cb(data.url, { title: file.name });
    };

    input.click();
  }
});