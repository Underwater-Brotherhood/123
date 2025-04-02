document.getElementById('contactForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  // Получаем элементы формы
  const form = e.target;
  const submitBtn = form.querySelector('button[type="submit"]');
  const formData = {
    name: form.elements.name.value.trim(),
    email: form.elements.email.value.trim(),
    comment: form.elements.comment.value.trim()
  };

  // Валидация на клиенте
  if (!formData.name || !formData.email || !formData.comment) {
    showAlert('Заполните все обязательные поля', 'error');
    return;
  }

  if (!validateEmail(formData.email)) {
    showAlert('Введите корректный email', 'error');
    return;
  }

  try {
    // Блокировка кнопки
    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Отправка...';

    const response = await fetch('/api/send', { // Путь должен совпадать с серверным!
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest' // Для идентификации AJAX-запросов
      },
      body: JSON.stringify(formData)
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Неизвестная ошибка сервера');
    }

    showAlert('Сообщение успешно отправлено!', 'success');
    form.reset();

  } catch (error) {
    showAlert(error.message || 'Ошибка соединения', 'error');
    console.error('Ошибка отправки:', error);
  } finally {
    // Разблокировка кнопки
    submitBtn.disabled = false;
    submitBtn.innerHTML = 'Отправить';
  }
});

// Вспомогательные функции
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showAlert(message, type = 'info') {
  const alertDiv = document.createElement('div');
  alertDiv.className = `alert ${type}`;
  alertDiv.textContent = message;
  
  const container = document.querySelector('.form-container');
  container.prepend(alertDiv);
  
  setTimeout(() => alertDiv.remove(), 5000);
}