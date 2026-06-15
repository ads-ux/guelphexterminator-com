exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const RESEND_KEY = 're_7bTWREUo_P1cRtEgUHB8hyXtyfCXWQ3io';
  const params = new URLSearchParams(event.body);

  // Honeypot — ignore bots
  if (params.get('bot-field')) {
    return { statusCode: 302, headers: { Location: '/contact.html?submitted=1' } };
  }

  const name    = params.get('name') || '';
  const phone   = params.get('phone') || '';
  const email   = params.get('email') || '';
  const address = params.get('address') || '';
  const service = params.get('service') || 'Not specified';
  const message = params.get('message') || '';

  const html = `<h2>New Quote Request — Guelph Exterminator</h2>
<p><strong>Name:</strong> ${name}</p>
<p><strong>Phone:</strong> ${phone}</p>
<p><strong>Email:</strong> ${email}</p>
<p><strong>Address:</strong> ${address}</p>
<p><strong>Service:</strong> ${service}</p>
<p><strong>Message:</strong><br>${message}</p>`;

  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + RESEND_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'voicemail@vrume.com',
        to: ['ads@vrume.com'],
        subject: 'New Quote Request from ' + name + ' — Guelph Exterminator',
        html: html
      })
    });
  } catch (e) {
    console.log('Email error:', e.message);
  }

  return {
    statusCode: 302,
    headers: { Location: '/contact.html?submitted=1' }
  };
};
