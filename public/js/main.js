document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('contactForm');
  
  if (!contactForm) {
      console.error('Форма не найдена! Проверьте ID элемента.');
      return;
  }

  contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const spinner = submitBtn.querySelector('.loading-spinner');
      const formData = {
          name: contactForm.elements.name.value.trim(),
          email: contactForm.elements.email.value.trim(),
          comment: contactForm.elements.comment.value.trim()
      };

      // Валидация
      if (!formData.name || !formData.email || !formData.comment) {
          showAlert('Заполните все обязательные поля', 'error');
          return;
      }

      if (!validateEmail(formData.email)) {
          showAlert('Введите корректный email', 'error');
          return;
      }

      try {
          // Показать состояние загрузки
          submitBtn.disabled = true;
          spinner.style.display = 'inline';

          const response = await fetch('/api/send.js', {
              method: 'POST',
              headers: { 
                  'Content-Type': 'application/json',
                  'X-Requested-With': 'XMLHttpRequest'
              },
              body: JSON.stringify(formData)
          });

          const data = await response.json();
          
          if (!response.ok) {
              throw new Error(data.error || 'Ошибка сервера');
          }

          showAlert('Сообщение успешно отправлено!', 'success');
          contactForm.reset();


      } finally {
          submitBtn.disabled = false;
          spinner.style.display = 'none';
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
      
      // Вставляем сообщение перед формой
      const formContainer = contactForm.parentElement;
      if (formContainer) {
          formContainer.insertBefore(alertDiv, contactForm);
          setTimeout(() => alertDiv.remove(), 5000);
      }
  }
});