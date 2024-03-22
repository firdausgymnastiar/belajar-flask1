const video = document.getElementById("video")
const canvas = document.getElementById("canvas")
const nimInput = document.getElementById("nim")

function startWebcam() {
  navigator.mediaDevices
    .getUserMedia({ video: true })
    .then((stream) => {
      video.srcObject = stream
    })
    .catch((error) => {
      console.error("Error accessing webcam:", error)
      alert(
        "Tidak dapat mengakses webcam. Pastikan Anda memberikan izin untuk mengakses kamera."
      )
    })
}

function capture() {
  const context = canvas.getContext("2d")
  context.drawImage(video, 0, 0, canvas.width, canvas.height)
  canvas.style.display = "block"
  video.style.display = "block"
}

function register() {
  const nim = nimInput.value
  const photo = dataURItoBlob(canvas.toDataURL())

  if (!nim || !photo) {
    alert("Nama dan foto wajah harus diisi!")
    return
  }
  const formData = new FormData()
  formData.append("nim", nim)
  formData.append("photo", photo, `${nim}.jpg`)

  fetch("/register2", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        alert("Data berhasil didaftarkan.")
        window.location.href = "/register"
      } else {
        alert("Gagal menyimpan data. Silakan coba lagi.")
      }
    })
    .catch((error) => {
      console.error("Error:", error)
    })
}
function dataURItoBlob(dataURI) {
  const byteString = atob(dataURI.split(",")[1])
  const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0]
  const ab = new ArrayBuffer(byteString.length)
  const ia = new Uint8Array(ab)
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i)
  }
  return new Blob([ab], { type: mimeString })
}

startWebcam()
