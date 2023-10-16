import main from "../main";
class UploadFilesService {
  upload(file, onUploadProgress) {
    let formData = new FormData();
    formData.append("file", file);
    return main.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      },
      onUploadProgress});
  }
  getFiles() {
    return main.get("/files");
  }
}
export default new UploadFilesService();
