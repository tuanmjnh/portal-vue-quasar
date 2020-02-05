export function getExtension(file, dot = true) {
  if (!file) return null
  let regx = /(?:\.([^.]+))?$/
  file = regx.exec(file)
  return file ? (dot ? file[0] : file[1]) : ''
}
export function isImage(value) {
  if (!value) return false
  return /\.(gif|jpg|jpeg|tiff|png|img|ico)$/i.test(value.toLowerCase())
}
export function isAudio(value) {
  if (!value) return false
  return /\.(mp3|wav|wave|ogg|m4a|3ga|4mp|aa3)$/i.test(value.toLowerCase())
}
export function isVideo(value) {
  if (!value) return false
  return /\.(3g2|3gp|3gp2|3gpp|3gpp2|amv|flv|gom|mp4|mov|mpe|mpeg|mpg||kmv|mkv|wvm|wmv)$/i.test(value.toLowerCase())
}
export function isPdf(value) {
  if (!value) return false
  return /\.(pdf)$/i.test(value.toLowerCase())
}
export function isDoc(value) {
  if (!value) return false
  return /\.(doc|docx)$/i.test(value.toLowerCase())
}
export function isSheet(value) {
  if (!value) return false
  return /\.(xls|xlsx)$/i.test(value.toLowerCase())
}
export function GetImage(file) {
  return new Promise((resolve, reject) => {
    const fReader = new FileReader()
    const img = document.createElement('img')
    fReader.onload = () => {
      img.src = fReader.result
      resolve(GetBase64Image(img))
    }
    fReader.readAsDataURL(file)
  })
}
export function GetBase64Image(img) {
  const canvas = document.createElement('canvas')
  canvas.width = img.width
  canvas.height = img.height

  const ctx = canvas.getContext('2d')
  ctx.drawImage(img, 0, 0)
  const dataURL = img.src
  return dataURL
}
