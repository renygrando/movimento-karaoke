export function generateIcon(size: number): string {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) return '';

  const radius = size * 0.2;
  ctx.fillStyle = '#1a1a2e';
  ctx.beginPath();
  ctx.roundRect(0, 0, size, size, radius);
  ctx.fill();

  const centerX = size / 2;
  const centerY = size / 2;

  ctx.fillStyle = 'rgba(157, 78, 221, 0.2)';
  ctx.beginPath();
  ctx.arc(centerX, centerY, size * 0.36, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = 'rgba(157, 78, 221, 0.3)';
  ctx.beginPath();
  ctx.arc(centerX, centerY, size * 0.26, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#e0aaff';
  ctx.lineWidth = size * 0.02;
  ctx.beginPath();
  ctx.arc(centerX, centerY, size * 0.18, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  const triangleSize = size * 0.15;
  ctx.moveTo(centerX - triangleSize * 0.5, centerY - triangleSize * 0.6);
  ctx.lineTo(centerX - triangleSize * 0.5, centerY + triangleSize * 0.6);
  ctx.lineTo(centerX + triangleSize * 0.7, centerY);
  ctx.closePath();
  ctx.fill();

  return canvas.toDataURL('image/png');
}

export async function generateAndDownloadIcons() {
  const icon192 = generateIcon(192);
  const icon512 = generateIcon(512);

  const link192 = document.createElement('a');
  link192.download = 'icon-192.png';
  link192.href = icon192;
  
  const link512 = document.createElement('a');
  link512.download = 'icon-512.png';
  link512.href = icon512;

  return { icon192, icon512 };
}
