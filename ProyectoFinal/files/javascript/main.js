/* =======================================================
   Hotel Costa Alegre — JavaScript principal
   Archivo: js/main.js
   Descripción: Interactividad de la página: navbar, menú
   hamburguesa, parallax, scroll reveal, contadores,
   tabs de habitaciones, lightbox de galería, audio
   ambiental y validación del formulario de reserva.
======================================================= */

// -------------------------------------------------------
    // 1. NAVBAR — Se vuelve sólida al hacer scroll
    // -------------------------------------------------------
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
      if (window.scrollY > 60) {
        navbar.classList.add('navbar-solida');
      } else {
        navbar.classList.remove('navbar-solida');
      }
    });

    // -------------------------------------------------------
    // 2. MENÚ HAMBURGUESA — Toggle en mobile
    // -------------------------------------------------------
    const botonHamburguesa = document.getElementById('boton-hamburguesa');
    const navbarMenu       = document.getElementById('navbar-menu');

    botonHamburguesa.addEventListener('click', () => {
      const estaAbierto = navbarMenu.classList.toggle('abierto');
      botonHamburguesa.classList.toggle('activo', estaAbierto);
      botonHamburguesa.setAttribute('aria-expanded', estaAbierto);
    });

    // Cerrar menú al hacer clic en cualquier link del menú
    navbarMenu.querySelectorAll('a').forEach(enlace => {
      enlace.addEventListener('click', () => {
        navbarMenu.classList.remove('abierto');
        botonHamburguesa.classList.remove('activo');
        botonHamburguesa.setAttribute('aria-expanded', 'false');
      });
    });

    // -------------------------------------------------------
    // 3. PARALLAX SUAVE EN EL HERO
    //    El fondo se desplaza a la mitad de la velocidad del scroll,
    //    creando un efecto de profundidad.
    // -------------------------------------------------------
    const heroFondo = document.getElementById('hero-fondo');

    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      // Solo aplica parallax mientras el hero sea visible
      if (scrollY < window.innerHeight) {
        heroFondo.style.transform = `scale(1.08) translateY(${scrollY * 0.3}px)`;
      }
    });

    // -------------------------------------------------------
    // 4. INTERSECTION OBSERVER — Animación de aparición en scroll
    //    Agrega la clase .visible cuando el elemento entra en pantalla.
    // -------------------------------------------------------
    const elementosReveal = document.querySelectorAll('.reveal');

    const observadorReveal = new IntersectionObserver((entradas) => {
      entradas.forEach(entrada => {
        if (entrada.isIntersecting) {
          entrada.target.classList.add('visible');
          // Una vez visible, dejar de observar para mejorar rendimiento
          observadorReveal.unobserve(entrada.target);
        }
      });
    }, {
      threshold: 0.12,      // 12% del elemento debe estar visible
      rootMargin: '0px 0px -40px 0px'
    });

    elementosReveal.forEach(el => observadorReveal.observe(el));

    // -------------------------------------------------------
    // 5. CONTADORES ANIMADOS DE ESTADÍSTICAS
    //    Cuenta desde 0 hasta el número indicado en data-destino.
    //    Se activa cuando el elemento entra en el viewport.
    // -------------------------------------------------------
    const numerosEstadisticas = document.querySelectorAll('.stat-numero[data-destino]');

    const observadorContador = new IntersectionObserver((entradas) => {
      entradas.forEach(entrada => {
        if (!entrada.isIntersecting) return;

        const elemento  = entrada.target;
        const valorFinal = parseInt(elemento.getAttribute('data-destino'), 10);
        const duracion   = 1800; // milisegundos
        const inicio     = performance.now();

        // Función recursiva de animación con requestAnimationFrame
        function animarContador(tiempoActual) {
          const progreso  = Math.min((tiempoActual - inicio) / duracion, 1);
          // Función de easing: ease-out cuadrático
          const easedProg = 1 - Math.pow(1 - progreso, 3);
          elemento.textContent = Math.floor(easedProg * valorFinal);
          if (progreso < 1) requestAnimationFrame(animarContador);
          else elemento.textContent = valorFinal; // asegurar valor final exacto
        }

        requestAnimationFrame(animarContador);
        observadorContador.unobserve(elemento);
      });
    }, { threshold: 0.5 });

    numerosEstadisticas.forEach(num => observadorContador.observe(num));

    // -------------------------------------------------------
    // 6. TABS DE HABITACIONES
    //    Al hacer clic en una pestaña se muestra el panel correspondiente.
    // -------------------------------------------------------
    const botonesTab = document.querySelectorAll('.tab-boton');
    const panelesTabs = document.querySelectorAll('.panel-habitacion');

    botonesTab.forEach(boton => {
      boton.addEventListener('click', () => {
        const tabObjetivo = boton.getAttribute('data-tab');

        // Desactivar todos los botones y paneles
        botonesTab.forEach(b => {
          b.classList.remove('activo');
          b.setAttribute('aria-selected', 'false');
        });
        panelesTabs.forEach(p => p.classList.remove('activo'));

        // Activar el botón y panel seleccionados
        boton.classList.add('activo');
        boton.setAttribute('aria-selected', 'true');
        document.getElementById('tab-' + tabObjetivo).classList.add('activo');
      });
    });

    // -------------------------------------------------------
    // 7. LIGHTBOX DE GALERÍA
    //    Al clic en una foto se abre el modal con la imagen ampliada.
    //    Soporta navegación prev/next y cierre con Escape.
    // -------------------------------------------------------
    const fotosGaleria  = document.querySelectorAll('.galeria-item');
    const lightbox      = document.getElementById('lightbox');
    const lightboxImg   = document.getElementById('lightbox-imagen');
    const btnCerrar     = document.getElementById('lightbox-cerrar');
    const btnPrev       = document.getElementById('lightbox-prev');
    const btnNext       = document.getElementById('lightbox-next');

    // Extraer las URLs de las fotos en un arreglo
    const urlsFotos = Array.from(fotosGaleria).map(item => item.querySelector('.galeria-foto').src);
    let indiceActual = 0;

    // Función para abrir el lightbox en un índice dado
    function abrirLightbox(indice) {
      indiceActual = indice;
      lightboxImg.src = urlsFotos[indiceActual];
      lightbox.classList.add('abierto');
      document.body.style.overflow = 'hidden'; // evitar scroll mientras está abierto
    }

    // Función para cerrar el lightbox
    function cerrarLightbox() {
      lightbox.classList.remove('abierto');
      document.body.style.overflow = '';
    }

    // Función para ir a la foto anterior
    function fotoAnterior() {
      indiceActual = (indiceActual - 1 + urlsFotos.length) % urlsFotos.length;
      lightboxImg.src = urlsFotos[indiceActual];
    }

    // Función para ir a la foto siguiente
    function fotoSiguiente() {
      indiceActual = (indiceActual + 1) % urlsFotos.length;
      lightboxImg.src = urlsFotos[indiceActual];
    }

    // Asignar eventos a cada foto de la galería
    fotosGaleria.forEach((item, i) => {
      item.addEventListener('click', () => abrirLightbox(i));
    });

    btnCerrar.addEventListener('click', cerrarLightbox);
    btnPrev.addEventListener('click', fotoAnterior);
    btnNext.addEventListener('click', fotoSiguiente);

    // Cerrar lightbox al hacer clic en el fondo oscuro
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) cerrarLightbox();
    });

    // Navegación con teclado (← → Escape)
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('abierto')) return;
      if (e.key === 'Escape')      cerrarLightbox();
      if (e.key === 'ArrowLeft')   fotoAnterior();
      if (e.key === 'ArrowRight')  fotoSiguiente();
    });

    // -------------------------------------------------------
    // 8. REPRODUCTOR DE AUDIO AMBIENTAL
    //    Botón play/pausa personalizado. Al reproducir, las
    //    barras de onda se animan; al pausar, se detienen.
    // -------------------------------------------------------
    const btnAudio       = document.getElementById('btn-audio');
    const audioAmbiental = document.getElementById('audio-ambiental');
    const ondaAudio      = document.querySelector('.onda-audio');

    if (btnAudio && audioAmbiental) {
      btnAudio.addEventListener('click', () => {
        if (audioAmbiental.paused) {
          audioAmbiental.play();
          btnAudio.textContent = '❚❚';
          btnAudio.setAttribute('aria-label', 'Pausar música ambiental');
          ondaAudio.classList.remove('pausada');
        } else {
          audioAmbiental.pause();
          btnAudio.textContent = '▶';
          btnAudio.setAttribute('aria-label', 'Reproducir música ambiental');
          ondaAudio.classList.add('pausada');
        }
      });

      // Si el audio se detiene por cualquier motivo, restablecer el botón
      audioAmbiental.addEventListener('pause', () => {
        btnAudio.textContent = '▶';
        ondaAudio.classList.add('pausada');
      });
    }


    // -------------------------------------------------------
    // 9. VALIDACIÓN DEL FORMULARIO DE RESERVA
    //    Valida todos los campos al hacer submit.
    //    Si hay errores, los muestra debajo de cada campo.
    //    Si todo es válido, muestra el mensaje de éxito.
    // -------------------------------------------------------
    const formulario = document.getElementById('formulario-reservacion');
    const mensajeExito = document.getElementById('formulario-exito');

    // Función auxiliar: mostrar o quitar error de un campo
    function mostrarError(campoId, errorId, mostrar) {
      const campo = document.getElementById(campoId);
      const error = document.getElementById(errorId);
      if (mostrar) {
        campo.classList.add('error');
        error.classList.add('visible');
      } else {
        campo.classList.remove('error');
        error.classList.remove('visible');
      }
    }

    formulario.addEventListener('submit', (e) => {
      e.preventDefault(); // Evitar recarga de página
      let formularioValido = true;

      // --- Validar nombre (mínimo 3 caracteres) ---
      const nombre = document.getElementById('campo-nombre').value.trim();
      const nombreInvalido = nombre.length < 3;
      mostrarError('campo-nombre', 'error-nombre', nombreInvalido);
      if (nombreInvalido) formularioValido = false;

      // --- Validar email (expresión regular básica) ---
      const email = document.getElementById('campo-email').value.trim();
      const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const emailInvalido = !regexEmail.test(email);
      mostrarError('campo-email', 'error-email', emailInvalido);
      if (emailInvalido) formularioValido = false;

      // --- Validar fecha de llegada (no puede ser vacía ni en el pasado) ---
      const llegada = document.getElementById('campo-llegada').value;
      const hoy = new Date().toISOString().split('T')[0]; // YYYY-MM-DD de hoy
      const llegadaInvalida = !llegada || llegada < hoy;
      mostrarError('campo-llegada', 'error-llegada', llegadaInvalida);
      if (llegadaInvalida) formularioValido = false;

      // --- Validar fecha de salida (debe ser posterior a la llegada) ---
      const salida = document.getElementById('campo-salida').value;
      const salidaInvalida = !salida || salida <= llegada;
      mostrarError('campo-salida', 'error-salida', salidaInvalida);
      if (salidaInvalida) formularioValido = false;

      // --- Validar tipo de habitación ---
      const habitacion = document.getElementById('campo-habitacion').value;
      const habitacionInvalida = !habitacion;
      mostrarError('campo-habitacion', 'error-habitacion', habitacionInvalida);
      if (habitacionInvalida) formularioValido = false;

      // --- Validar número de huéspedes ---
      const huespedes = document.getElementById('campo-huespedes').value;
      const huespedesInvalido = !huespedes;
      mostrarError('campo-huespedes', 'error-huespedes', huespedesInvalido);
      if (huespedesInvalido) formularioValido = false;

      // Si el formulario es válido, mostrar confirmación y ocultar el form
      if (formularioValido) {
        formulario.style.display = 'none';
        mensajeExito.style.display = 'block';
        // Hacer scroll hacia el mensaje de éxito
        mensajeExito.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });

    // Limpiar error de un campo en tiempo real cuando el usuario empieza a escribir
    ['campo-nombre', 'campo-email', 'campo-llegada', 'campo-salida',
     'campo-habitacion', 'campo-huespedes'].forEach(id => {
      const campo = document.getElementById(id);
      campo.addEventListener('input', () => {
        campo.classList.remove('error');
        // Quitar el mensaje de error asociado
        const errorEl = document.getElementById('error-' + id.replace('campo-', ''));
        if (errorEl) errorEl.classList.remove('visible');
      });
    });

    // -------------------------------------------------------
    // BONUS: Smooth scroll personalizado para links del navbar
    // (complementa el scroll-behavior: smooth del CSS)
    // -------------------------------------------------------
    document.querySelectorAll('a[href^="#"]').forEach(enlace => {
      enlace.addEventListener('click', (e) => {
        const href = enlace.getAttribute('href');
        if (href === '#') return;
        const destino = document.querySelector(href);
        if (destino) {
          e.preventDefault();
          const offsetTop = destino.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({ top: offsetTop, behavior: 'smooth' });
        }
      });
    });

    // -------------------------------------------------------
    // INICIALIZACIÓN: Establecer fecha mínima en los campos
    // de fecha para que no se puedan elegir fechas pasadas.
    // -------------------------------------------------------
    const fechaHoy = new Date().toISOString().split('T')[0];
    document.getElementById('campo-llegada').min = fechaHoy;
    document.getElementById('campo-salida').min  = fechaHoy;

    // Cuando cambia la llegada, ajustar el mínimo de salida automáticamente
    document.getElementById('campo-llegada').addEventListener('change', (e) => {
      document.getElementById('campo-salida').min = e.target.value;
    });