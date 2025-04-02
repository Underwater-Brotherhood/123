document.querySelector('.contact-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const formData = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    comment: document.getElementById('comment').value
  };

  try {
    const response = await fetch('/api/send-to-telegram', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    const result = await response.json();
    
    if (response.ok) {
      alert('Сообщение отправлено!');
      e.target.reset();
    } else {
      alert(`Ошибка: ${result.error}`);
    }
    
  } catch (error) {
    alert('Ошибка сети');
  }
});