async function check() {
  const res = await fetch('http://localhost:3000/web-systems');
  const text = await res.text();
  const aside = text.match(/<aside[\s\S]*?<\/aside>/);
  if (!aside) {
    console.log('No aside found');
    return;
  }
  const links = [...aside[0].matchAll(/href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)].map(
    m => `${m[1]} -> ${m[2].replace(/<[^>]+>/g, '').trim()}`
  );
  console.log('SIDEBAR LINKS ON /web-systems:\n' + links.join('\n'));
}
check();
