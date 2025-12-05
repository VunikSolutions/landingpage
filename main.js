import './style.scss';
import Swiper from 'swiper';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { createClient } from '@supabase/supabase-js';

// Configurar cliente Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Variáveis de ambiente do Supabase não configuradas!');
}

const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// ============================================
// FUNÇÕES GLOBAIS
// ============================================
function scrollToForm() {
  const formSection = document.getElementById('formulario');
  if (formSection) {
    formSection.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
}

function closeMobileMenu() {
  const sideMenu = document.getElementById('sideMenu');
  const menuOverlay = document.getElementById('menuOverlay');
  if (sideMenu) sideMenu.classList.remove('open');
  if (menuOverlay) menuOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

// ============================================
// MENU MOBILE
// ============================================
document.addEventListener('DOMContentLoaded', function () {
  const menuToggle = document.getElementById('menuToggle');
  const closeBtn = document.getElementById('closeMenu');
  const sideMenu = document.getElementById('sideMenu');
  const menuOverlay = document.getElementById('menuOverlay');

  // Abrir menu
  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      if (sideMenu) sideMenu.classList.add('open');
      if (menuOverlay) menuOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  }

  // Fechar menu
  if (closeBtn) {
    closeBtn.addEventListener('click', closeMobileMenu);
  }

  // Fechar ao clicar no overlay
  if (menuOverlay) {
    menuOverlay.addEventListener('click', closeMobileMenu);
  }

  // Fechar ao clicar em links do menu
  const menuLinks = document.querySelectorAll('.side-menu nav a');
  menuLinks.forEach(link => {
    link.addEventListener('click', () => {
      setTimeout(closeMobileMenu, 300); // Delay para scroll suave funcionar
    });
  });
});

// ============================================
// SCROLL SUAVE PARA LINKS
// ============================================
document.addEventListener('DOMContentLoaded', function () {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach(link => {
    link.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#' || href === '#hero') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
});

// ============================================
// HEADER STICKY (OTIMIZADO COM THROTTLING)
// ============================================
document.addEventListener('DOMContentLoaded', function () {
  const header = document.querySelector('header');
  const headerLogo = document.getElementById('headerLogo');

  if (header && headerLogo) {
    let ticking = false;
    let lastScroll = 0;

    function updateHeader() {
      const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

      if (currentScroll > 50) {
        if (!header.classList.contains('scrolled')) {
          header.classList.add('scrolled');
          headerLogo.src = '/vunik_logo_azul.svg';
        }
      } else {
        if (header.classList.contains('scrolled')) {
          header.classList.remove('scrolled');
          headerLogo.src = '/logo.svg';
        }
      }

      lastScroll = currentScroll;
      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(updateHeader);
        ticking = true;
      }
    }, { passive: true });
  }
});

// ============================================
// SWIPER PARA DEPOIMENTOS (MOBILE)
// ============================================
document.addEventListener('DOMContentLoaded', function () {
  const testimonialsSwiperEl = document.getElementById('testimonialsSwiper');

  if (testimonialsSwiperEl && window.innerWidth <= 1023) {
    new Swiper('#testimonialsSwiper', {
      modules: [Pagination],
      slidesPerView: 1,
      spaceBetween: 24,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
    });
  }

  // Re-inicializar em resize se necessário
  let swiperInstance = null;
  window.addEventListener('resize', () => {
    if (window.innerWidth <= 1023 && !swiperInstance && testimonialsSwiperEl) {
      swiperInstance = new Swiper('#testimonialsSwiper', {
        modules: [Pagination],
        slidesPerView: 1,
        spaceBetween: 24,
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
      });
    }
  });
});

// ============================================
// FAQ ACCORDION
// ============================================
document.addEventListener('DOMContentLoaded', function () {
  const faqItems = document.querySelectorAll('.faq-item');

  // Função para abrir um FAQ específico
  function openFaqItem(item) {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    // Fechar todos os outros
    faqItems.forEach(otherItem => {
      if (otherItem !== item) {
        otherItem.classList.remove('active');
        otherItem.querySelector('.faq-question').classList.remove('active');
        otherItem.querySelector('.faq-answer').classList.remove('active');
      }
    });

    // Abrir o item atual
    item.classList.add('active');
    question.classList.add('active');
    answer.classList.add('active');

    // Scroll suave para o item
    setTimeout(() => {
      item.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  }

  // Função para fechar um FAQ específico
  function closeFaqItem(item) {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    item.classList.remove('active');
    question.classList.remove('active');
    answer.classList.remove('active');
  }

  // Adicionar event listeners
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      const faqId = item.id;

      if (isActive) {
        // Fechar e remover hash da URL
        closeFaqItem(item);
        if (window.history.replaceState) {
          window.history.replaceState(null, null, window.location.pathname);
        }
      } else {
        // Abrir e atualizar URL
        openFaqItem(item);
        if (window.history.replaceState) {
          window.history.replaceState(null, null, `#${faqId}`);
        }
      }
    });
  });

  // Verificar se há hash na URL ao carregar a página
  function checkHashOnLoad() {
    const hash = window.location.hash;
    if (hash) {
      const targetItem = document.querySelector(hash);
      if (targetItem && targetItem.classList.contains('faq-item')) {
        // Scroll para a seção FAQ primeiro
        const faqSection = document.getElementById('faq');
        if (faqSection) {
          faqSection.scrollIntoView({ behavior: 'smooth' });
        }
        // Depois abrir o item específico
        setTimeout(() => {
          openFaqItem(targetItem);
        }, 500);
      }
    }
  }

  // Verificar hash ao carregar
  checkHashOnLoad();

  // Verificar mudanças no hash (navegação do browser)
  window.addEventListener('hashchange', checkHashOnLoad);
});

// ============================================
// MÁSCARA DE WHATSAPP
// ============================================
function maskWhatsApp(value) {
  // Remove tudo que não é número
  const numbers = value.replace(/\D/g, '');

  // Aplica máscara (XX) XXXXX-XXXX
  if (numbers.length <= 2) {
    return numbers.length > 0 ? `(${numbers}` : numbers;
  } else if (numbers.length <= 7) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
  } else if (numbers.length <= 11) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
  } else {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  }
}

document.addEventListener('DOMContentLoaded', function () {
  const whatsappInput = document.getElementById('whatsapp');

  if (whatsappInput) {
    whatsappInput.addEventListener('input', (e) => {
      e.target.value = maskWhatsApp(e.target.value);
      validateWhatsApp(e.target);
    });

    whatsappInput.addEventListener('blur', (e) => {
      validateWhatsApp(e.target);
    });
  }
});

// ============================================
// VALIDAÇÕES DO FORMULÁRIO
// ============================================
function validateNome(input) {
  const value = input.value.trim();
  const error = document.getElementById('nomeError');

  if (value.length < 3) {
    input.classList.add('error');
    input.classList.remove('valid');
    if (error) {
      error.textContent = 'Nome deve ter pelo menos 3 caracteres';
      error.classList.add('show');
    }
    return false;
  } else {
    input.classList.remove('error');
    input.classList.add('valid');
    if (error) error.classList.remove('show');
    return true;
  }
}

function validateWhatsApp(input) {
  const value = input.value.replace(/\D/g, '');
  const error = document.getElementById('whatsappError');

  if (value.length !== 11) {
    input.classList.add('error');
    input.classList.remove('valid');
    if (error) {
      error.textContent = 'WhatsApp deve ter 11 dígitos (DDD + número)';
      error.classList.add('show');
    }
    return false;
  } else {
    input.classList.remove('error');
    input.classList.add('valid');
    if (error) error.classList.remove('show');
    return true;
  }
}

function validateEspecialidade(select) {
  const value = select.value;
  const error = document.getElementById('especialidadeError');
  const outroWrapper = document.getElementById('especialidade-outro-wrapper');
  const outroInput = document.getElementById('especialidade-outro');
  const outroError = document.getElementById('especialidadeOutroError');

  if (!value) {
    select.classList.add('error');
    select.classList.remove('valid');
    if (error) {
      error.textContent = 'Especialidade é obrigatória';
      error.classList.add('show');
    }
    if (outroWrapper) outroWrapper.style.display = 'none';
    return false;
  } else if (value === 'outro') {
    // Se "Outro" foi selecionado, validar o campo de texto
    if (outroWrapper) outroWrapper.style.display = 'block';
    const outroValue = outroInput ? outroInput.value.trim() : '';

    if (outroValue.length < 2) {
      select.classList.remove('error');
      select.classList.add('valid');
      if (error) error.classList.remove('show');

      if (outroInput) {
        outroInput.classList.add('error');
        outroInput.classList.remove('valid');
      }
      if (outroError) {
        outroError.textContent = 'Digite a especialidade';
        outroError.classList.add('show');
      }
      return false;
    } else {
      select.classList.remove('error');
      select.classList.add('valid');
      if (error) error.classList.remove('show');

      if (outroInput) {
        outroInput.classList.remove('error');
        outroInput.classList.add('valid');
      }
      if (outroError) outroError.classList.remove('show');
      return true;
    }
  } else {
    // Especialidade selecionada da lista
    select.classList.remove('error');
    select.classList.add('valid');
    if (error) error.classList.remove('show');
    if (outroWrapper) outroWrapper.style.display = 'none';
    if (outroInput) {
      outroInput.value = '';
      outroInput.classList.remove('error', 'valid');
    }
    if (outroError) outroError.classList.remove('show');
    return true;
  }
}

function validateSelect(select) {
  const value = select.value;
  const errorId = select.id + 'Error';
  const error = document.getElementById(errorId);

  if (!value) {
    select.classList.add('error');
    select.classList.remove('valid');
    if (error) {
      error.textContent = 'Este campo é obrigatório';
      error.classList.add('show');
    }
    return false;
  } else {
    select.classList.remove('error');
    select.classList.add('valid');
    if (error) error.classList.remove('show');
    return true;
  }
}

function validateForm() {
  const nome = document.getElementById('nome');
  const whatsapp = document.getElementById('whatsapp');
  const especialidade = document.getElementById('especialidade');
  const faturamento = document.getElementById('faturamento');
  const objetivo = document.getElementById('objetivo');
  const tempoAtendimento = document.getElementById('tempo-atendimento');
  const submitBtn = document.getElementById('submitBtn');

  const validations = [
    validateNome(nome),
    validateWhatsApp(whatsapp),
    validateEspecialidade(especialidade),
    validateSelect(faturamento),
    validateSelect(objetivo),
    validateSelect(tempoAtendimento)
  ];

  const allValid = validations.every(v => v === true);

  if (submitBtn) {
    submitBtn.disabled = !allValid;
  }

  return allValid;
}

// Event listeners para validação em tempo real
document.addEventListener('DOMContentLoaded', function () {
  const nome = document.getElementById('nome');
  const whatsapp = document.getElementById('whatsapp');
  const especialidade = document.getElementById('especialidade');
  const faturamento = document.getElementById('faturamento');
  const objetivo = document.getElementById('objetivo');
  const tempoAtendimento = document.getElementById('tempo-atendimento');

  if (nome) {
    nome.addEventListener('blur', () => {
      validateNome(nome);
      validateForm();
    });
    nome.addEventListener('input', () => {
      if (nome.value.length >= 3) {
        validateNome(nome);
        validateForm();
      }
    });
  }

  if (whatsapp) {
    whatsapp.addEventListener('blur', () => {
      validateWhatsApp(whatsapp);
      validateForm();
    });
  }

  if (especialidade) {
    especialidade.addEventListener('change', () => {
      validateEspecialidade(especialidade);
      validateForm();
    });
  }

  const especialidadeOutro = document.getElementById('especialidade-outro');
  if (especialidadeOutro) {
    especialidadeOutro.addEventListener('blur', () => {
      validateEspecialidade(especialidade);
      validateForm();
    });
    especialidadeOutro.addEventListener('input', () => {
      if (especialidadeOutro.value.length >= 2) {
        validateEspecialidade(especialidade);
        validateForm();
      }
    });
  }

  if (faturamento) {
    faturamento.addEventListener('change', () => {
      validateSelect(faturamento);
      validateForm();
    });
  }

  if (objetivo) {
    objetivo.addEventListener('change', () => {
      validateSelect(objetivo);
      validateForm();
    });
  }

  if (tempoAtendimento) {
    tempoAtendimento.addEventListener('change', () => {
      validateSelect(tempoAtendimento);
      validateForm();
    });
  }
});

// ============================================
// SUBMISSÃO DO FORMULÁRIO
// ============================================
document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (!validateForm()) {
        return;
      }

      const especialidadeSelect = document.getElementById('especialidade');
      const especialidadeValue = especialidadeSelect.value === 'outro'
        ? document.getElementById('especialidade-outro').value.trim()
        : especialidadeSelect.value;

      const formData = {
        nome: document.getElementById('nome').value.trim(),
        whatsapp: document.getElementById('whatsapp').value,
        especialidade: especialidadeValue,
        faturamento: document.getElementById('faturamento').value,
        objetivo: document.getElementById('objetivo').value,
        tempo_atendimento: document.getElementById('tempo-atendimento').value,
      };

      const submitBtn = document.getElementById('submitBtn');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando...';
      }

      try {
        // Verificar se Supabase está configurado
        if (!supabase) {
          throw new Error('Supabase não configurado. Verifique as variáveis de ambiente.');
        }

        // Inserir no Supabase
        const { data, error } = await supabase
          .from('leads')
          .insert([formData])
          .select();

        if (error) {
          console.error('Erro ao salvar lead:', error);
          throw error;
        }

        // Chamar Edge Function para enviar notificação por email
        try {
          const { error: notificationError } = await supabase.functions.invoke('send-lead-notification', {
            body: { lead: data[0] }
          });

          if (notificationError) {
            console.warn('Erro ao enviar notificação (lead salvo):', notificationError);
            // Não falhar o formulário se apenas a notificação falhar
          }
        } catch (notificationError) {
          console.warn('Erro ao chamar função de notificação (lead salvo):', notificationError);
          // Não falhar o formulário se apenas a notificação falhar
        }

        // Sucesso - mostrar snackbar e mensagem
        showSnackbar();

        // Ocultar formulário e mostrar mensagem de sucesso
        form.style.display = 'none';
        if (formSuccess) {
          formSuccess.classList.add('show');
        }

        // Scroll para mensagem de sucesso
        if (formSuccess) {
          formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        // Reset do formulário (opcional)
        form.reset();
        validateForm();

      } catch (error) {
        console.error('Erro ao enviar formulário:', error);

        // Mostrar mensagem de erro ao usuário
        alert('Erro ao enviar formulário. Por favor, tente novamente ou entre em contato conosco diretamente.');

        // Reabilitar botão
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Enviar';
        }
      }
    });
  }
});

// ============================================
// LAZY LOADING DE IMAGENS
// ============================================
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          observer.unobserve(img);
        }
      }
    });
  });

  document.addEventListener('DOMContentLoaded', () => {
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => imageObserver.observe(img));
  });
}

// ============================================
// ANIMAÇÃO DO GRÁFICO DE COMPARAÇÃO
// ============================================
document.addEventListener('DOMContentLoaded', function () {
  const chartContainer = document.getElementById('comparisonChart');

  if (!chartContainer) return;

  const chartBars = chartContainer.querySelectorAll('.chart-bar');
  let hasAnimated = false;

  // Função para animar as barras
  function animateBars() {
    if (hasAnimated) return;

    chartBars.forEach((bar, index) => {
      const value = parseInt(bar.getAttribute('data-value'));
      const delay = index * 200; // Delay escalonado

      setTimeout(() => {
        bar.style.setProperty('--bar-width', `${value}%`);
        bar.classList.add('animated');
      }, delay);
    });

    hasAnimated = true;
  }

  // Intersection Observer para animar quando visível
  if ('IntersectionObserver' in window) {
    const chartObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasAnimated) {
          animateBars();
        }
      });
    }, {
      threshold: 0.3, // Anima quando 30% do gráfico está visível
      rootMargin: '0px'
    });

    chartObserver.observe(chartContainer);
  } else {
    // Fallback para navegadores sem Intersection Observer
    animateBars();
  }

  // Removido scroll listener desnecessário que causava performance issues
  // A animação já é controlada pelo IntersectionObserver
});

// ============================================
// ANIMAÇÃO DE CONTAGEM CRESCENTE - MÉTRICAS
// ============================================
document.addEventListener('DOMContentLoaded', function () {
  const metricsSection = document.getElementById('metricas');

  if (!metricsSection) return;

  const metricNumbers = metricsSection.querySelectorAll('.metric-number');
  let hasAnimated = false;

  // Função para formatar número com separadores
  function formatNumber(num, decimal = 0) {
    if (decimal > 0) {
      return num.toFixed(decimal).replace('.', ',');
    }
    return Math.floor(num).toLocaleString('pt-BR');
  }

  // Função para animar um número
  function animateNumber(element, duration = 2000) {
    const target = parseFloat(element.getAttribute('data-target'));
    const suffix = element.getAttribute('data-suffix') || '';
    const prefix = element.getAttribute('data-prefix') || '';
    const decimal = parseInt(element.getAttribute('data-decimal')) || 0;

    if (isNaN(target)) return;

    const startTime = performance.now();
    const startValue = 0;

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentValue = startValue + (target - startValue) * easeOut;

      const formattedValue = formatNumber(currentValue, decimal);
      element.textContent = prefix + formattedValue + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        // Garantir valor final exato
        const finalFormatted = formatNumber(target, decimal);
        element.textContent = prefix + finalFormatted + suffix;
      }
    }

    requestAnimationFrame(update);
  }

  // Função para animar todos os números
  function animateMetrics() {
    if (hasAnimated) return;

    metricNumbers.forEach((number, index) => {
      const delay = index * 150; // Delay escalonado entre números
      setTimeout(() => {
        animateNumber(number, 2000);
      }, delay);
    });

    hasAnimated = true;
  }

  // Intersection Observer para animar quando visível
  if ('IntersectionObserver' in window) {
    const metricsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasAnimated) {
          animateMetrics();
        }
      });
    }, {
      threshold: 0.3, // Anima quando 30% da seção está visível
      rootMargin: '0px'
    });

    metricsObserver.observe(metricsSection);
  } else {
    // Fallback para navegadores sem Intersection Observer
    animateMetrics();
  }
});

// ============================================
// SNACKBAR DE SUCESSO
// ============================================
let snackbarTimeout = null;

function showSnackbar() {
  const snackbar = document.getElementById('snackbar');
  if (!snackbar) return;

  // Reset progress bar
  const progress = snackbar.querySelector('.snackbar-progress');
  if (progress) {
    progress.style.transition = 'none';
    progress.style.transform = 'scaleX(0)';
    setTimeout(() => {
      progress.style.transition = 'transform 5s linear';
      progress.style.transform = 'scaleX(1)';
    }, 10);
  }

  // Show snackbar
  snackbar.classList.add('show');

  // Clear existing timeout
  if (snackbarTimeout) {
    clearTimeout(snackbarTimeout);
  }

  // Auto-hide after 5 seconds
  snackbarTimeout = setTimeout(() => {
    closeSnackbar();
  }, 5000);
}

function closeSnackbar() {
  const snackbar = document.getElementById('snackbar');
  if (!snackbar) return;

  snackbar.classList.remove('show');

  if (snackbarTimeout) {
    clearTimeout(snackbarTimeout);
    snackbarTimeout = null;
  }
}

// ============================================
// EXPORTAR FUNÇÕES GLOBAIS
// ============================================
window.scrollToForm = scrollToForm;
window.closeMobileMenu = closeMobileMenu;
window.closeSnackbar = closeSnackbar;

// ============================================
// LAZY LOAD ANALYTICS
// ============================================
setTimeout(() => {
  import('@vercel/analytics').then(({ inject }) => {
    inject();
  }).catch(() => {
    // Analytics não disponível, continuar normalmente
  });
}, 1000);
