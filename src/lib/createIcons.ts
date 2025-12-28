export function createPWAIcons() {
  const canvas192 = document.createElement('canvas');
  canvas192.width = 192;
  canvas192.height = 192;
  const ctx192 = canvas192.getContext('2d');

  if (ctx192) {
    ctx192.fillStyle = '#1a1a2e';
    ctx192.beginPath();
    ctx192.roundRect(0, 0, 192, 192, 40);
    ctx192.fill();

    ctx192.fillStyle = 'rgba(157, 78, 221, 0.2)';
    ctx192.beginPath();
    ctx192.arc(96, 96, 70, 0, Math.PI * 2);
    ctx192.fill();

    ctx192.fillStyle = 'rgba(157, 78, 221, 0.3)';
    ctx192.beginPath();
    ctx192.arc(96, 96, 50, 0, Math.PI * 2);
    ctx192.fill();

    ctx192.strokeStyle = '#e0aaff';
    ctx192.lineWidth = 4;
    ctx192.beginPath();
    ctx192.arc(96, 96, 35, 0, Math.PI * 2);
    ctx192.stroke();

    ctx192.fillStyle = '#ffffff';
    ctx192.beginPath();
    ctx192.moveTo(75, 75);
    ctx192.lineTo(75, 117);
    ctx192.lineTo(110, 96);
    ctx192.closePath();
    ctx192.fill();
  }

  const canvas512 = document.createElement('canvas');
  canvas512.width = 512;
  canvas512.height = 512;
  const ctx512 = canvas512.getContext('2d');

  if (ctx512) {
    ctx512.fillStyle = '#1a1a2e';
    ctx512.beginPath();
    ctx512.roundRect(0, 0, 512, 512, 110);
    ctx512.fill();

    ctx512.fillStyle = 'rgba(157, 78, 221, 0.2)';
    ctx512.beginPath();
    ctx512.arc(256, 256, 190, 0, Math.PI * 2);
    ctx512.fill();

    ctx512.fillStyle = 'rgba(157, 78, 221, 0.3)';
    ctx512.beginPath();
    ctx512.arc(256, 256, 140, 0, Math.PI * 2);
    ctx512.fill();

    ctx512.strokeStyle = '#e0aaff';
    ctx512.lineWidth = 10;
    ctx512.beginPath();
    ctx512.arc(256, 256, 100, 0, Math.PI * 2);
    ctx512.stroke();

    ctx512.fillStyle = '#ffffff';
    ctx512.beginPath();
    ctx512.moveTo(200, 200);
    ctx512.lineTo(200, 328);
    ctx512.lineTo(300, 264);
    ctx512.closePath();
    ctx512.fill();

    ctx512.font = 'bold 60px Arial';
    ctx512.fillStyle = '#e0aaff';
    ctx512.textAlign = 'center';
    ctx512.fillText('MOVIMENTO', 256, 450);
  }

  return {
    icon192: canvas192.toDataURL('image/png'),
    icon512: canvas512.toDataURL('image/png'),
  };
}
