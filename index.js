$(document).ready(function(){
    var array = [];
    var heightWindow = $(window).height();
    var widthWindow = $(window).width();

    for(var i = 0; i < 40; i++){
        array.push({
            top: Math.floor(Math.random()*heightWindow),
            left: Math.floor(Math.random()*widthWindow),
            id: i
        })
    }
    array.forEach(function(value){
        var newEllipse = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
        newEllipse.setAttribute('class','ellipse');
        newEllipse.setAttribute('id','ellipse_'+value.id);
        newEllipse.setAttribute('cx',value.left);
        newEllipse.setAttribute('cy',value.top);
        newEllipse.setAttribute('rx',5);
        newEllipse.setAttribute('ry',5);

        $('#svg').append(newEllipse);
    })

    $(window).mousemove(function(event){
        $('line').remove();
        (array.filter(val => Math.abs(val.top - event.pageY) <= 350 && Math.abs(val.left - event.pageX) <= 350)).forEach(function(value){
            var newLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            newLine.setAttribute('class','line');
            newLine.setAttribute('id','line_'+value.id);
            newLine.setAttribute('x1',value.left);
            newLine.setAttribute('y1',value.top);
            newLine.setAttribute('x2',event.pageX);
            newLine.setAttribute('y2',event.pageY);
            newLine.setAttribute('stroke','black');
            $('#svg').append(newLine);
        })
    })
    $(window).mouseout(function(event){
        $('line').remove();
    });
    setInterval(function(){
        // Math.random()*(max - min ) + min
        array.forEach(function(value, key){
            var top = Math.random()*((value.top + 2) - (value.top - 2) ) + (value.top - 2);
            var left = Math.random()*((value.left + 2) - (value.left - 2) ) + (value.left - 2);
            array[key].top = top;
            array[key].left = left;

            var $ellipse = $('#ellipse_' + value.id);
            $ellipse.animate({dot: 0},{
                step: () => {$ellipse.attr('cx', left), $ellipse.attr('cy', top)},
                duration: 1
            });

            if($('#line_' + value.id).lengh){
                var $line = $('#line_' + value.id);
                $line.animate({dot: 0},{
                step: () => {$line.attr('x1', left), $line.attr('y1', top)},
                duration: 1
            });
            }
        })
    },500)
    console.log(array);
})

// Array com os caminhos das imagens para o slideshow
// const backgroundImages = [
 //   './assets/ester-0129.jpg',
  //  './assets/ester-0129.jpg', // Assumindo que existem estas imagens
   // './assets/ester-0129.jpg', // Você deve substituir por imagens reais
    //'./assets/ester-0129.jpg'
//];

// let currentImageIndex = 0;
// const slideshowInterval = 5000; // Tempo em milissegundos (5 segundos)

// Função para alternar entre as imagens de fundo
function changeBackgroundImage() {
    currentImageIndex = (currentImageIndex + 1) % backgroundImages.length;
    const newImageUrl = `url('${backgroundImages[currentImageIndex]}')`;
    
    // Cria um elemento de imagem temporário para pré-carregar
    const tempImg = new Image();
    tempImg.src = backgroundImages[currentImageIndex];
    
    tempImg.onload = function() {
        // Quando a imagem estiver carregada, atualiza o fundo
        document.documentElement.style.setProperty('--current-background', newImageUrl);
        
        // Aplica a nova imagem com uma transição suave
        const beforeElement = document.createElement('style');
        beforeElement.innerHTML = `body::before { background-image: ${newImageUrl}; }`;
        document.head.appendChild(beforeElement);
        
        // Remove o estilo antigo após a transição
        setTimeout(() => {
            if (document.head.contains(beforeElement.previousSibling)) {
                document.head.removeChild(beforeElement.previousSibling);
            }
        }, 1000);
    };
}

// Inicia o slideshow quando a página é carregada
document.addEventListener('DOMContentLoaded', function() {
    // Código existente para criar bolinhas/ellipses
    // ...

    // Inicia o slideshow automático
    setInterval(changeBackgroundImage, slideshowInterval);
});

document.addEventListener('DOMContentLoaded', () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const title = entry.target.querySelector('.contact-title');
                
                if (title) title.classList.add('animate');
                // Removida a referência ao botão
                
                // Parar de observar após animar
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5 // Dispara quando 50% da seção estiver visível
    });

    const contactSection = document.querySelector('.contact-section');
    if (contactSection) {
        observer.observe(contactSection);
    }
});

// Função para criar efeito de grid infinito
document.addEventListener('DOMContentLoaded', function() {
  const gridContainer = document.querySelector('.infinite-grid');
  if (!gridContainer) return;
  
  // Observer para detectar quando o usuário está próximo do final do grid
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Quando o usuário se aproxima do final, rolar suavemente de volta ao topo
        const gridItems = document.querySelectorAll('.grid-item');
        if (gridItems.length > 0) {
          const gridSection = document.querySelector('.grid-section');
          const lastVisibleItem = Array.from(gridItems).filter(item => {
            const rect = item.getBoundingClientRect();
            return rect.bottom > 0 && rect.top < window.innerHeight;
          }).pop();
          
          if (lastVisibleItem && lastVisibleItem === gridItems[gridItems.length - 1]) {
            // Adicionar classe para efeito visual de transição
            gridSection.classList.add('transition-scroll');
            
            // Após um curto delay, rolar suavemente de volta
            setTimeout(() => {
              gridItems[0].scrollIntoView({ behavior: 'smooth' });
              setTimeout(() => {
                gridSection.classList.remove('transition-scroll');
              }, 1000);
            }, 200);
          }
        }
      }
    });
  }, { threshold: 0.1 });
  
  // Observar o último item do grid
  const gridItems = document.querySelectorAll('.grid-item');
  if (gridItems.length > 0) {
    observer.observe(gridItems[gridItems.length - 1]);
  }

  // Melhorar a renderização dos embeds do Instagram
  if (window.instgrm) {
    window.instgrm.Embeds.process();
  } else {
    // Tentar novamente quando o script do Instagram carregar
    const instagramScript = document.querySelector('script[src*="instagram.com/embed.js"]');
    instagramScript.addEventListener('load', function() {
      if (window.instgrm) {
        window.instgrm.Embeds.process();
      }
    });
  }
});

// Função aprimorada para personalizar os embeds do Instagram após carregamento
function customizeInstagramEmbeds() {
  // Esperar pelos embeds carregarem
  if (window.instgrm && window.instgrm.Embeds) {
    // Aguardar a renderização completa
    setTimeout(() => {
      // Encontrar todos os botões do Instagram e aplicar estilos e textos
      document.querySelectorAll('.instagram-media').forEach(embed => {
        // Botões "View on Instagram"
        const instagramButtons = embed.querySelectorAll('button, [role="button"], .sqdOP, ._4EzTm');
        instagramButtons.forEach(button => {
          if (button.textContent.includes('View') || button.textContent.includes('more')) {
            button.style.backgroundColor = '#000';
            button.style.color = '#fff';
            button.style.borderRadius = '4px';
            
            // Substituir o conteúdo com texto em português
            const originalHTML = button.innerHTML;
            button.innerHTML = `<span style="display:none">${originalHTML}</span><span style="color:white;font-weight:bold">Ver mais no Instagram</span>`;
          }
        });
        
        // Links de perfil "View profile"
        const profileLinks = embed.querySelectorAll('a[href*="instagram.com/"]:not([href*="?img_index"])');
        profileLinks.forEach(link => {
          if (link.textContent.includes('View') || link.textContent.includes('profile')) {
            const originalHTML = link.innerHTML;
            link.innerHTML = `<span style="display:none">${originalHTML}</span><span>Ver perfil</span>`;
          }
        });
        
        // Outros textos que possam precisar de tradução
        const timeElements = embed.querySelectorAll('time');
        timeElements.forEach(time => {
          const nextSibling = time.nextElementSibling;
          if (nextSibling && (nextSibling.textContent.includes('View') || nextSibling.textContent.includes('more'))) {
            const originalHTML = nextSibling.innerHTML;
            nextSibling.innerHTML = `<span style="display:none">${originalHTML}</span><span>Ver mais</span>`;
          }
        });
      });

      console.log('Embeds do Instagram personalizados com sucesso');
    }, 2000); // Aguardar 2 segundos após o carregamento
  }
}

// Adicionar evento para processar os embeds quando o script do Instagram estiver carregado
document.addEventListener('DOMContentLoaded', function() {
  const instagramScript = document.querySelector('script[src*="instagram.com/embed.js"]');
  if (instagramScript) {
    instagramScript.addEventListener('load', function() {
      if (window.instgrm) {
        window.instgrm.Embeds.process();
        customizeInstagramEmbeds();
      }
    });
  }
  
  // Verificar periodicamente se os embeds foram carregados e aplicar personalizações
  const checkEmbeds = setInterval(() => {
    if (document.querySelector('.instagram-media')) {
      customizeInstagramEmbeds();
      
      // Continuamos verificando por mais um tempo para garantir que todos os embeds foram traduzidos
      setTimeout(() => {
        customizeInstagramEmbeds();
        clearInterval(checkEmbeds);
      }, 5000);
    }
  }, 1000);
});
