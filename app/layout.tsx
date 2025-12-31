import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/Navigation";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Chinghua Ivy Lu website",
  description: "Hello! I'm currently a student at National Taiwan University. I have a deep love for traveling and observing the world around me.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <LanguageProvider>
          <Navigation />
          <main>{children}</main>
          <Footer />
        </LanguageProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // Riga Carousel 1 (English)
                let rigaCarousel1Index = 0;
                
                function getRigaCarousel1Elements() {
                  return {
                    container: document.querySelector('#riga-carousel-1 .slider-container'),
                    slides: document.querySelector('#riga-carousel-1 .slides-container'),
                    total: document.querySelector('#riga-carousel-1 .slides-container') ? document.querySelector('#riga-carousel-1 .slides-container').children.length : 0
                  };
                }
                
                function getRigaCarousel1Width() {
                  const container = document.querySelector('#riga-carousel-1 .slider-container');
                  return container ? container.offsetWidth : 600;
                }
                
                function rigaCarousel1ShowSlide() {
                  const { slides } = getRigaCarousel1Elements();
                  if (slides) {
                    const width = getRigaCarousel1Width();
                    slides.style.transform = 'translateX(' + (-rigaCarousel1Index * width) + 'px)';
                    // Update dots
                    const dots = document.querySelectorAll('#riga-carousel-1 .riga-dot-1');
                    dots.forEach(function(dot, i) {
                      if (i === rigaCarousel1Index) {
                        dot.classList.remove('bg-gray-400');
                        dot.classList.add('bg-gray-800');
                      } else {
                        dot.classList.remove('bg-gray-800');
                        dot.classList.add('bg-gray-400');
                      }
                    });
                  }
                }
                
                window.rigaCarousel1Next = function() {
                  const { total } = getRigaCarousel1Elements();
                  rigaCarousel1Index = (rigaCarousel1Index + 1) % total;
                  rigaCarousel1ShowSlide();
                };
                
                window.rigaCarousel1Prev = function() {
                  const { total } = getRigaCarousel1Elements();
                  rigaCarousel1Index = (rigaCarousel1Index - 1 + total) % total;
                  rigaCarousel1ShowSlide();
                };
                
                window.rigaCarousel1GoTo = function(idx) {
                  rigaCarousel1Index = idx;
                  rigaCarousel1ShowSlide();
                };
                
                // Riga Carousel 1 Zh (Chinese)
                let rigaCarousel1ZhIndex = 0;
                
                function getRigaCarousel1ZhElements() {
                  return {
                    container: document.querySelector('#riga-carousel-1-zh .slider-container'),
                    slides: document.querySelector('#riga-carousel-1-zh .slides-container'),
                    total: document.querySelector('#riga-carousel-1-zh .slides-container') ? document.querySelector('#riga-carousel-1-zh .slides-container').children.length : 0
                  };
                }
                
                function getRigaCarousel1ZhWidth() {
                  const container = document.querySelector('#riga-carousel-1-zh .slider-container');
                  return container ? container.offsetWidth : 600;
                }
                
                function rigaCarousel1ZhShowSlide() {
                  const { slides } = getRigaCarousel1ZhElements();
                  if (slides) {
                    const width = getRigaCarousel1ZhWidth();
                    slides.style.transform = 'translateX(' + (-rigaCarousel1ZhIndex * width) + 'px)';
                    // Update dots
                    const dots = document.querySelectorAll('#riga-carousel-1-zh .riga-dot-1-zh');
                    dots.forEach(function(dot, i) {
                      if (i === rigaCarousel1ZhIndex) {
                        dot.classList.remove('bg-gray-400');
                        dot.classList.add('bg-gray-800');
                      } else {
                        dot.classList.remove('bg-gray-800');
                        dot.classList.add('bg-gray-400');
                      }
                    });
                  }
                }
                
                window.rigaCarousel1ZhNext = function() {
                  const { total } = getRigaCarousel1ZhElements();
                  rigaCarousel1ZhIndex = (rigaCarousel1ZhIndex + 1) % total;
                  rigaCarousel1ZhShowSlide();
                };
                
                window.rigaCarousel1ZhPrev = function() {
                  const { total } = getRigaCarousel1ZhElements();
                  rigaCarousel1ZhIndex = (rigaCarousel1ZhIndex - 1 + total) % total;
                  rigaCarousel1ZhShowSlide();
                };
                
                window.rigaCarousel1ZhGoTo = function(idx) {
                  rigaCarousel1ZhIndex = idx;
                  rigaCarousel1ZhShowSlide();
                };
                
                // Initialize carousels when DOM is ready
                function initRigaCarousels() {
                  // Carousel 1 (English)
                  const carousel1 = getRigaCarousel1Elements();
                  if (carousel1.slides && carousel1.container) {
                    const width = getRigaCarousel1Width();
                    const images = carousel1.slides.querySelectorAll('.riga-slide-img');
                    images.forEach(function(img) {
                      img.style.width = width + 'px';
                    });
                    rigaCarousel1ShowSlide();
                  }
                  
                  // Carousel 1 Zh (Chinese)
                  const carousel1Zh = getRigaCarousel1ZhElements();
                  if (carousel1Zh.slides && carousel1Zh.container) {
                    const width = getRigaCarousel1ZhWidth();
                    const images = carousel1Zh.slides.querySelectorAll('.riga-slide-img-zh');
                    images.forEach(function(img) {
                      img.style.width = width + 'px';
                    });
                    rigaCarousel1ZhShowSlide();
                  }
                }
                
                // Wait for DOM to be ready
                function waitForCarousels() {
                  if (document.querySelector('#riga-carousel-1 .slides-container') || document.querySelector('#riga-carousel-1-zh .slides-container')) {
                    initRigaCarousels();
                  } else {
                    setTimeout(waitForCarousels, 100);
                  }
                }
                
                if (document.readyState === 'loading') {
                  document.addEventListener('DOMContentLoaded', waitForCarousels);
                } else {
                  setTimeout(waitForCarousels, 100);
                }
                
                // Riga Carousel 2 (English) - Central Market
                let rigaCarousel2Index = 0;
                
                function getRigaCarousel2Elements() {
                  return {
                    container: document.querySelector('#riga-carousel-2 .slider-container'),
                    slides: document.querySelector('#riga-carousel-2 .slides-container'),
                    total: document.querySelector('#riga-carousel-2 .slides-container') ? document.querySelector('#riga-carousel-2 .slides-container').children.length : 0
                  };
                }
                
                function getRigaCarousel2Width() {
                  const container = document.querySelector('#riga-carousel-2 .slider-container');
                  return container ? container.offsetWidth : 600;
                }
                
                function rigaCarousel2ShowSlide() {
                  const { slides } = getRigaCarousel2Elements();
                  if (slides) {
                    const width = getRigaCarousel2Width();
                    slides.style.transform = 'translateX(' + (-rigaCarousel2Index * width) + 'px)';
                    // Update dots
                    const dots = document.querySelectorAll('#riga-carousel-2 .riga-dot-2');
                    dots.forEach(function(dot, i) {
                      if (i === rigaCarousel2Index) {
                        dot.classList.remove('bg-gray-400');
                        dot.classList.add('bg-gray-800');
                      } else {
                        dot.classList.remove('bg-gray-800');
                        dot.classList.add('bg-gray-400');
                      }
                    });
                  }
                }
                
                window.rigaCarousel2Next = function() {
                  const { total } = getRigaCarousel2Elements();
                  rigaCarousel2Index = (rigaCarousel2Index + 1) % total;
                  rigaCarousel2ShowSlide();
                };
                
                window.rigaCarousel2Prev = function() {
                  const { total } = getRigaCarousel2Elements();
                  rigaCarousel2Index = (rigaCarousel2Index - 1 + total) % total;
                  rigaCarousel2ShowSlide();
                };
                
                window.rigaCarousel2GoTo = function(idx) {
                  rigaCarousel2Index = idx;
                  rigaCarousel2ShowSlide();
                };
                
                // Riga Carousel 2 Zh (Chinese) - Central Market
                let rigaCarousel2ZhIndex = 0;
                
                function getRigaCarousel2ZhElements() {
                  return {
                    container: document.querySelector('#riga-carousel-2-zh .slider-container'),
                    slides: document.querySelector('#riga-carousel-2-zh .slides-container'),
                    total: document.querySelector('#riga-carousel-2-zh .slides-container') ? document.querySelector('#riga-carousel-2-zh .slides-container').children.length : 0
                  };
                }
                
                function getRigaCarousel2ZhWidth() {
                  const container = document.querySelector('#riga-carousel-2-zh .slider-container');
                  return container ? container.offsetWidth : 600;
                }
                
                function rigaCarousel2ZhShowSlide() {
                  const { slides } = getRigaCarousel2ZhElements();
                  if (slides) {
                    const width = getRigaCarousel2ZhWidth();
                    slides.style.transform = 'translateX(' + (-rigaCarousel2ZhIndex * width) + 'px)';
                    // Update dots
                    const dots = document.querySelectorAll('#riga-carousel-2-zh .riga-dot-2-zh');
                    dots.forEach(function(dot, i) {
                      if (i === rigaCarousel2ZhIndex) {
                        dot.classList.remove('bg-gray-400');
                        dot.classList.add('bg-gray-800');
                      } else {
                        dot.classList.remove('bg-gray-800');
                        dot.classList.add('bg-gray-400');
                      }
                    });
                  }
                }
                
                window.rigaCarousel2ZhNext = function() {
                  const { total } = getRigaCarousel2ZhElements();
                  rigaCarousel2ZhIndex = (rigaCarousel2ZhIndex + 1) % total;
                  rigaCarousel2ZhShowSlide();
                };
                
                window.rigaCarousel2ZhPrev = function() {
                  const { total } = getRigaCarousel2ZhElements();
                  rigaCarousel2ZhIndex = (rigaCarousel2ZhIndex - 1 + total) % total;
                  rigaCarousel2ZhShowSlide();
                };
                
                window.rigaCarousel2ZhGoTo = function(idx) {
                  rigaCarousel2ZhIndex = idx;
                  rigaCarousel2ZhShowSlide();
                };
                
                // Initialize carousels when DOM is ready
                function initRigaCarousels() {
                  // Carousel 1 (English)
                  const carousel1 = getRigaCarousel1Elements();
                  if (carousel1.slides && carousel1.container) {
                    const width = getRigaCarousel1Width();
                    const images = carousel1.slides.querySelectorAll('.riga-slide-img');
                    images.forEach(function(img) {
                      img.style.width = width + 'px';
                    });
                    rigaCarousel1ShowSlide();
                  }
                  
                  // Carousel 1 Zh (Chinese)
                  const carousel1Zh = getRigaCarousel1ZhElements();
                  if (carousel1Zh.slides && carousel1Zh.container) {
                    const width = getRigaCarousel1ZhWidth();
                    const images = carousel1Zh.slides.querySelectorAll('.riga-slide-img-zh');
                    images.forEach(function(img) {
                      img.style.width = width + 'px';
                    });
                    rigaCarousel1ZhShowSlide();
                  }
                  
                  // Carousel 2 (English)
                  const carousel2 = getRigaCarousel2Elements();
                  if (carousel2.slides && carousel2.container) {
                    const width = getRigaCarousel2Width();
                    const images = carousel2.slides.querySelectorAll('.riga-slide-img-2');
                    images.forEach(function(img) {
                      img.style.width = width + 'px';
                    });
                    rigaCarousel2ShowSlide();
                  }
                  
                  // Carousel 2 Zh (Chinese)
                  const carousel2Zh = getRigaCarousel2ZhElements();
                  if (carousel2Zh.slides && carousel2Zh.container) {
                    const width = getRigaCarousel2ZhWidth();
                    const images = carousel2Zh.slides.querySelectorAll('.riga-slide-img-2-zh');
                    images.forEach(function(img) {
                      img.style.width = width + 'px';
                    });
                    rigaCarousel2ZhShowSlide();
                  }
                }
                
                // Wait for DOM to be ready
                function waitForCarousels() {
                  if (document.querySelector('#riga-carousel-1 .slides-container') || document.querySelector('#riga-carousel-1-zh .slides-container') || document.querySelector('#riga-carousel-2 .slides-container') || document.querySelector('#riga-carousel-2-zh .slides-container')) {
                    initRigaCarousels();
                  } else {
                    setTimeout(waitForCarousels, 100);
                  }
                }
                
                if (document.readyState === 'loading') {
                  document.addEventListener('DOMContentLoaded', waitForCarousels);
                } else {
                  setTimeout(waitForCarousels, 100);
                }
                
                // Handle window resize
                window.addEventListener('resize', function() {
                  const carousel1 = getRigaCarousel1Elements();
                  if (carousel1.slides && carousel1.container) {
                    const width = getRigaCarousel1Width();
                    const images = carousel1.slides.querySelectorAll('.riga-slide-img');
                    images.forEach(function(img) {
                      img.style.width = width + 'px';
                    });
                    rigaCarousel1ShowSlide();
                  }
                  
                  const carousel1Zh = getRigaCarousel1ZhElements();
                  if (carousel1Zh.slides && carousel1Zh.container) {
                    const width = getRigaCarousel1ZhWidth();
                    const images = carousel1Zh.slides.querySelectorAll('.riga-slide-img-zh');
                    images.forEach(function(img) {
                      img.style.width = width + 'px';
                    });
                    rigaCarousel1ZhShowSlide();
                  }
                  
                  const carousel2 = getRigaCarousel2Elements();
                  if (carousel2.slides && carousel2.container) {
                    const width = getRigaCarousel2Width();
                    const images = carousel2.slides.querySelectorAll('.riga-slide-img-2');
                    images.forEach(function(img) {
                      img.style.width = width + 'px';
                    });
                    rigaCarousel2ShowSlide();
                  }
                  
                  const carousel2Zh = getRigaCarousel2ZhElements();
                  if (carousel2Zh.slides && carousel2Zh.container) {
                    const width = getRigaCarousel2ZhWidth();
                    const images = carousel2Zh.slides.querySelectorAll('.riga-slide-img-2-zh');
                    images.forEach(function(img) {
                      img.style.width = width + 'px';
                    });
                    rigaCarousel2ZhShowSlide();
                  }
                });
                
                // NTU Carousel 1
                let ntuCarousel1Index = 0;
                
                function getNtuCarousel1Elements() {
                  return {
                    container: document.querySelector('#ntu-carousel-1 .slider-container'),
                    slides: document.querySelector('#ntu-carousel-1 .slides-container'),
                    total: document.querySelector('#ntu-carousel-1 .slides-container') ? document.querySelector('#ntu-carousel-1 .slides-container').children.length : 0
                  };
                }
                
                function getNtuCarousel1Width() {
                  const container = document.querySelector('#ntu-carousel-1 .slider-container');
                  return container ? container.offsetWidth : 600;
                }
                
                function ntuCarousel1ShowSlide() {
                  const { slides } = getNtuCarousel1Elements();
                  if (slides) {
                    const width = getNtuCarousel1Width();
                    slides.style.transform = 'translateX(' + (-ntuCarousel1Index * width) + 'px)';
                    // Update dots
                    const dots = document.querySelectorAll('#ntu-carousel-1 .ntu-dot-1');
                    dots.forEach(function(dot, i) {
                      if (i === ntuCarousel1Index) {
                        dot.classList.remove('bg-gray-400');
                        dot.classList.add('bg-gray-800');
                      } else {
                        dot.classList.remove('bg-gray-800');
                        dot.classList.add('bg-gray-400');
                      }
                    });
                  }
                }
                
                window.ntuCarousel1Next = function() {
                  const { total } = getNtuCarousel1Elements();
                  ntuCarousel1Index = (ntuCarousel1Index + 1) % total;
                  ntuCarousel1ShowSlide();
                };
                
                window.ntuCarousel1Prev = function() {
                  const { total } = getNtuCarousel1Elements();
                  ntuCarousel1Index = (ntuCarousel1Index - 1 + total) % total;
                  ntuCarousel1ShowSlide();
                };
                
                window.ntuCarousel1GoTo = function(idx) {
                  ntuCarousel1Index = idx;
                  ntuCarousel1ShowSlide();
                };
                
                // Initialize NTU carousel when DOM is ready
                function initNtuCarousel() {
                  const carousel1 = getNtuCarousel1Elements();
                  if (carousel1.slides && carousel1.container) {
                    const width = getNtuCarousel1Width();
                    const images = carousel1.slides.querySelectorAll('.ntu-slide-img');
                    images.forEach(function(img) {
                      img.style.width = width + 'px';
                      img.style.height = '450px';
                      img.style.flexShrink = '0';
                      img.style.display = 'block';
                    });
                    ntuCarousel1ShowSlide();
                  }
                }
                
                // Wait for DOM to be ready
                function waitForNtuCarousel() {
                  if (document.querySelector('#ntu-carousel-1 .slides-container')) {
                    initNtuCarousel();
                  } else {
                    setTimeout(waitForNtuCarousel, 100);
                  }
                }
                
                // Initialize immediately if DOM is ready
                if (document.readyState === 'loading') {
                  document.addEventListener('DOMContentLoaded', waitForNtuCarousel);
                } else {
                  setTimeout(waitForNtuCarousel, 100);
                }
                
                // Also listen for content updates (for dynamically loaded content)
                const observer = new MutationObserver(function(mutations) {
                  mutations.forEach(function(mutation) {
                    if (mutation.addedNodes.length > 0) {
                      const carousel = document.querySelector('#ntu-carousel-1 .slides-container');
                      if (carousel && !carousel.hasAttribute('data-initialized')) {
                        carousel.setAttribute('data-initialized', 'true');
                        setTimeout(initNtuCarousel, 50);
                      }
                    }
                  });
                });
                
                // Start observing after a short delay
                setTimeout(function() {
                  observer.observe(document.body, {
                    childList: true,
                    subtree: true
                  });
                }, 500);
                
                // Handle window resize for NTU carousel
                let ntuResizeTimeout;
                window.addEventListener('resize', function() {
                  clearTimeout(ntuResizeTimeout);
                  ntuResizeTimeout = setTimeout(function() {
                    const carousel1 = getNtuCarousel1Elements();
                    if (carousel1.slides && carousel1.container) {
                      const width = getNtuCarousel1Width();
                      const images = carousel1.slides.querySelectorAll('.ntu-slide-img');
                      images.forEach(function(img) {
                        img.style.width = width + 'px';
                        img.style.height = '450px';
                        img.style.flexShrink = '0';
                      });
                      ntuCarousel1ShowSlide();
                    }
                  }, 100);
                });
              })();
            `,
          }}
        />
      </body>
    </html>
  );
}
