let buf = Buffer.from('what the huh')

let convertTo = (data, byteSize) => {
  let rawLength = data.length * byteSize,
      outLength = rawLength / 12,
      padBytes = Number.isInteger(outLength)
  
  outLength = parseInt(outLength) + 1
  padBytes = padBytes ? 0 : Math.abs(rawLength - (outLength * 12))

  return data[0]
}