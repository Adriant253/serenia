import React, { useEffect, useRef, useState } from 'react';
import './sonidosRelajantes.css';

interface Sonido {
  id: number;
  titulo: string;
  duracion: string;
  audioUrl: string;
  imagenUrl: string;
}

interface Album {
  id: number;
  nombre: string;
  subtitulo: string;
  descripcion: string;
  sonidos: Sonido[];
}

interface HistorialItem {
  id: number;
  titulo: string;
  fecha: string;
}

/*
  Cada audio utiliza una dirección diferente.

  Los archivos se reproducen en bucle, por lo que la duración mostrada
  representa la duración sugerida para la sesión, no necesariamente
  la duración real del archivo MP3.
*/
const dataAlbumes: Album[] = [
  {
    id: 1,
    nombre: 'Santuario Natural',
    subtitulo: 'Naturaleza y Agua',
    descripcion:
      'Enfocado en sonidos de lluvia, ríos, olas del mar y bosques.',
    sonidos: [
      {
        id: 1,
        titulo: 'Ecos de la Lluvia',
        duracion: '12:00',
        audioUrl:
          'https://raw.githubusercontent.com/PicoPixl/sleep-sounds/main/sounds/rain-leaves.mp3',
        imagenUrl:
          'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?q=80&w=400',
      },
      {
        id: 2,
        titulo: 'Mareas de Serenidad',
        duracion: '15:30',
        audioUrl:
          'https://raw.githubusercontent.com/PicoPixl/sleep-sounds/main/sounds/ocean-waves.mp3',
        imagenUrl:
          'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=400',
      },
      {
        id: 3,
        titulo: 'Ríos de Calma',
        duracion: '10:00',
        audioUrl:
          'https://raw.githubusercontent.com/PicoPixl/sleep-sounds/main/sounds/mountain-stream.mp3',
        imagenUrl:
          'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=400',
      },
      {
        id: 4,
        titulo: 'El Latido del Bosque',
        duracion: '20:00',
        audioUrl:
          'https://raw.githubusercontent.com/PicoPixl/sleep-sounds/main/sounds/forest-birds.mp3',
        imagenUrl:
          'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=400',
      },
    ],
  },
  {
    id: 2,
    nombre: 'Sueño Infinito',
    subtitulo: 'Para Dormir y Descanso Profundo',
    descripcion:
      'Sonidos de frecuencias bajas, sutiles y constantes que ayudan a apagar la mente por la noche.',
    sonidos: [
      {
        id: 5,
        titulo: 'Sueño Profundo',
        duracion: '30:00',
        audioUrl:
          'https://raw.githubusercontent.com/PicoPixl/sleep-sounds/main/sounds/pink-noise.mp3',
        imagenUrl:
          'https://i.pinimg.com/1200x/27/71/de/2771de7bfa1cb1aba3362dd5e1fe752c.jpg',
      },
      {
        id: 6,
        titulo: 'Descanso Absoluto',
        duracion: '30:00',
        audioUrl:
          'https://raw.githubusercontent.com/PicoPixl/sleep-sounds/main/sounds/crickets.mp3',
        imagenUrl:
          'https://i.pinimg.com/736x/dc/5d/46/dc5d464845143e5457973ba749c6aa6c.jpg',
      },
      {
        id: 7,
        titulo: 'Calma Eterna',
        duracion: '30:00',
        audioUrl:
          'https://raw.githubusercontent.com/PicoPixl/sleep-sounds/main/sounds/wind-pines.mp3',
        imagenUrl:
          'https://i.pinimg.com/1200x/5b/a0/a4/5ba0a4e8f9fb2f46faebe69cfdcd36b0.jpg',
      },
      {
        id: 8,
        titulo: 'Tranquilidad Infinita',
        duracion: '30:00',
        audioUrl:
          'https://raw.githubusercontent.com/BreizhKebab/souffle-audio/main/wave.mp3',
        imagenUrl:
          'https://i.pinimg.com/736x/a3/9e/78/a39e786234640be42f0e0c575c5259d3.jpg',
      },
    ],
  },
  {
    id: 3,
    nombre: 'Refugio Cálido',
    subtitulo: 'Enfoque y Trabajo',
    descripcion:
      'Sonidos continuos como ruido blanco, lluvia en una ventana o murmullos de paz.',
    sonidos: [
      {
        id: 9,
        titulo: 'Espacio de Enfoque',
        duracion: '45:00',
        audioUrl:
          'https://raw.githubusercontent.com/BreizhKebab/souffle-audio/main/coffee.mp3',
        imagenUrl:
          'https://i.pinimg.com/1200x/fe/42/fe/fe42feb33aaa3ff5f0e02847c88b28c3.jpg',
      },
      {
        id: 10,
        titulo: 'Frecuencias Claras',
        duracion: '15:00',
        audioUrl:
          'https://raw.githubusercontent.com/PicoPixl/sleep-sounds/main/sounds/white-noise.mp3',
        imagenUrl:
          'https://i.pinimg.com/1200x/09/e6/37/09e637df7344a51b123e3e6df4b52b31.jpg',
      },
      {
        id: 11,
        titulo: 'Mente en Calma',
        duracion: '10:00',
        audioUrl:
          'https://raw.githubusercontent.com/BreizhKebab/souffle-audio/main/birds.mp3',
        imagenUrl:
          'https://i.pinimg.com/736x/7d/f4/e1/7df4e1482a00a63f58fb72cd353ad2af.jpg',
      },
      {
        id: 12,
        titulo: 'Tormenta Lejana',
        duracion: '30:00',
        audioUrl:
          'https://raw.githubusercontent.com/PicoPixl/sleep-sounds/main/sounds/thunderstorm.mp3',
        imagenUrl:
          'https://cdn.pixabay.com/photo/2012/12/20/10/13/thunderstorm-71366_640.jpg',
      },
    ],
  },
  {
    id: 4,
    nombre: 'Espacio Interior',
    subtitulo: 'Meditación y Espiritualidad',
    descripcion:
      'Tonos de cuencos tibetanos, ambientes naturales y campanas sutiles.',
    sonidos: [
      {
        id: 13,
        titulo: 'El Viaje Interior',
        duracion: '11:11',
        audioUrl:
          'https://raw.githubusercontent.com/PicoPixl/sleep-sounds/main/sounds/singing-bowls.mp3',
        imagenUrl:
          'https://i.pinimg.com/1200x/84/e9/14/84e914d5aa010475c6b39d1a545a6ae8.jpg',
      },
      {
        id: 14,
        titulo: 'Despertar Silencioso',
        duracion: '14:00',
        audioUrl:
          'https://raw.githubusercontent.com/BreizhKebab/souffle-audio/main/rainforest.mp3',
        imagenUrl:
          'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?q=80&w=400',
      },
      {
        id: 15,
        titulo: 'Claridad Mental',
        duracion: '10:00',
        audioUrl:
          'https://raw.githubusercontent.com/BreizhKebab/souffle-audio/main/beach.mp3',
        imagenUrl:
          'https://i.pinimg.com/736x/a3/4d/93/a34d93ce3a78e0e2bc9f97a4c08c99a5.jpg',
      },
      {
        id: 16,
        titulo: 'Luz Sutil',
        duracion: '08:45',
        audioUrl:
          'https://raw.githubusercontent.com/BreizhKebab/souffle-audio/main/fireplace.mp3',
        imagenUrl:
          'https://img.magnific.com/foto-gratis/puesta-sol-playa-ai-generada_268835-11222.jpg?semt=ais_hybrid&w=740&q=80',
      },
    ],
  },
  {
    id: 5,
    nombre: 'Silencio Cósmico',
    subtitulo: 'Concentración profunda',
    descripcion:
      'Ecos, texturas profundas y sonidos continuos para estimular la creatividad y la calma.',
    sonidos: [
      {
        id: 17,
        titulo: 'Eco y Reverberación Infinita',
        duracion: '60:00',
        audioUrl:
          'https://raw.githubusercontent.com/BreizhKebab/souffle-audio/main/wind.mp3',
        imagenUrl:
          'https://i.pinimg.com/1200x/78/2f/71/782f71e1057f77110fd22e94ad19626d.jpg',
      },
      {
        id: 18,
        titulo: 'Variaciones de Ruido Marrón y Gris',
        duracion: '30:00',
        audioUrl:
          'https://raw.githubusercontent.com/BreizhKebab/souffle-audio/main/train.mp3',
        imagenUrl:
          'https://i.pinimg.com/736x/99/c0/a3/99c0a3c5b9c4cebf4a6090ba3bfb7848.jpg',
      },
      {
        id: 19,
        titulo: 'Pads de Cristal y Texturas Heladas',
        duracion: '25:00',
        audioUrl:
          'https://raw.githubusercontent.com/PicoPixl/sleep-sounds/main/sounds/piano-drones.mp3',
        imagenUrl:
          'https://i.pinimg.com/736x/99/c0/a3/99c0a3c5b9c4cebf4a6090ba3bfb7848.jpg',
      },
      {
        id: 20,
        titulo: 'Pulsos Binaurales Profundos',
        duracion: '40:00',
        audioUrl:
          'https://raw.githubusercontent.com/PicoPixl/sleep-sounds/main/sounds/binaural-theta.mp3',
        imagenUrl:
          'https://i.pinimg.com/1200x/35/43/a3/3543a354c48f5f3ba98bef3ffedeeb28.jpg',
      },
    ],
  },
];

export const SonidosRelajantes: React.FC = () => {
  const [currentSonido, setCurrentSonido] =
    useState<Sonido | null>(null);

  const [isPlaying, setIsPlaying] =
    useState<boolean>(false);

  const [volumen, setVolumen] =
    useState<number>(0.5);

  const [
    temporizadorSeleccionado,
    setTemporizadorSeleccionado,
  ] = useState<string>('');

  const [
    tiempoRestanteSegundos,
    setTiempoRestanteSegundos,
  ] = useState<number | null>(null);

  const [historial, setHistorial] =
    useState<HistorialItem[]>([]);

  const [favoritos, setFavoritos] =
    useState<number[]>([]);

  const [audioError, setAudioError] =
    useState<string>('');

  const audioRef =
    useRef<HTMLAudioElement | null>(null);

  /*
    Recuperar historial y favoritos guardados.
  */
  useEffect(() => {
    try {
      const localHistorial =
        localStorage.getItem(
          'serenia_historial',
        );

      const localFavoritos =
        localStorage.getItem(
          'serenia_favoritos',
        );

      if (localHistorial) {
        setHistorial(
          JSON.parse(localHistorial),
        );
      }

      if (localFavoritos) {
        setFavoritos(
          JSON.parse(localFavoritos),
        );
      }
    } catch (error) {
      console.error(
        'No se pudo leer LocalStorage:',
        error,
      );
    }
  }, []);

  /*
    El temporizador funciona en segundos.

    Solo continúa bajando mientras el audio
    se está reproduciendo.

    Al pausar el audio, el temporizador también
    se pausa.

    Al volver a reproducirlo, continúa desde
    el tiempo que quedaba.
  */
  const temporizadorEnCurso =
    isPlaying &&
    tiempoRestanteSegundos !== null &&
    tiempoRestanteSegundos > 0;

  useEffect(() => {
    if (!temporizadorEnCurso) {
      return;
    }

    const timerInterval =
      window.setInterval(() => {
        setTiempoRestanteSegundos(
          (tiempoAnterior) => {
            if (
              tiempoAnterior === null
            ) {
              return null;
            }

            return Math.max(
              tiempoAnterior - 1,
              0,
            );
          },
        );
      }, 1000);

    return () => {
      window.clearInterval(
        timerInterval,
      );
    };
  }, [temporizadorEnCurso]);

  /*
    Cuando el contador llega a 00:00:

    - Se pausa el audio.
    - Se devuelve la pista al inicio.
    - Se limpia el temporizador.
  */
  useEffect(() => {
    if (
      tiempoRestanteSegundos !== 0
    ) {
      return;
    }

    const audio = audioRef.current;

    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }

    setIsPlaying(false);

    setTemporizadorSeleccionado('');

    const limpiarContador =
      window.setTimeout(() => {
        setTiempoRestanteSegundos(
          null,
        );
      }, 1000);

    return () => {
      window.clearTimeout(
        limpiarContador,
      );
    };
  }, [tiempoRestanteSegundos]);

  const actualizarHistorial = (
    sonido: Sonido,
  ) => {
    const nuevoRegistro: HistorialItem = {
      id: sonido.id,
      titulo: sonido.titulo,
      fecha:
        new Date().toLocaleTimeString(
          [],
          {
            hour: '2-digit',
            minute: '2-digit',
          },
        ),
    };

    setHistorial(
      (historialAnterior) => {
        const nuevoHistorial = [
          nuevoRegistro,

          ...historialAnterior.filter(
            (item) =>
              item.id !== sonido.id,
          ),
        ].slice(0, 5);

        localStorage.setItem(
          'serenia_historial',
          JSON.stringify(
            nuevoHistorial,
          ),
        );

        return nuevoHistorial;
      },
    );
  };

  /*
    Reproduce la pista que ya se encuentra
    cargada en el elemento <audio>.
  */
  const reproducirAudioActual =
    async () => {
      const audio = audioRef.current;

      if (!audio || !currentSonido) {
        return;
      }

      try {
        setAudioError('');

        audio.volume = volumen;

        await audio.play();
      } catch (error) {
        console.error(
          'No se pudo reproducir el audio:',
          error,
        );

        setAudioError(
          'El navegador bloqueó la reproducción o el archivo no está disponible.',
        );

        setIsPlaying(false);
      }
    };

  /*
    Alterna entre reproducción y pausa.

    No vuelve a cargar el archivo.
  */
  const alternarReproduccion =
    async () => {
      const audio = audioRef.current;

      if (!audio || !currentSonido) {
        return;
      }

      if (audio.paused) {
        await reproducirAudioActual();
      } else {
        audio.pause();
      }
    };

  /*
    Selecciona un sonido.

    El archivo solo se carga cuando realmente
    se cambia de tarjeta.

    Mover el volumen o cambiar el temporizador
    no ejecuta audio.load().
  */
  const seleccionarSonido = async (
    sonido: Sonido,
  ) => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    setAudioError('');

    /*
      Si se selecciona la misma tarjeta,
      solamente se pausa o continúa.
    */
    if (
      currentSonido?.id === sonido.id
    ) {
      await alternarReproduccion();
      return;
    }

    audio.pause();

    audio.src = sonido.audioUrl;
    audio.currentTime = 0;
    audio.volume = volumen;

    audio.load();

    setCurrentSonido(sonido);

    actualizarHistorial(sonido);

    try {
      await audio.play();
    } catch (error) {
      console.error(
        'No se pudo reproducir el audio:',
        error,
      );

      setAudioError(
        'El navegador bloqueó la reproducción o el archivo no está disponible.',
      );

      setIsPlaying(false);
    }
  };

  const handleToggleFavorito = (
    sonidoId: number,
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.stopPropagation();

    setFavoritos(
      (favoritosAnteriores) => {
        const nuevosFavoritos =
          favoritosAnteriores.includes(
            sonidoId,
          )
            ? favoritosAnteriores.filter(
                (id) =>
                  id !== sonidoId,
              )
            : [
                ...favoritosAnteriores,
                sonidoId,
              ];

        localStorage.setItem(
          'serenia_favoritos',
          JSON.stringify(
            nuevosFavoritos,
          ),
        );

        return nuevosFavoritos;
      },
    );
  };

  /*
    Cambiar el volumen:

    - No pausa el audio.
    - No reinicia el audio.
    - No vuelve a cargar el archivo.
  */
  const cambiarVolumen = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const nuevoVolumen = Number(
      event.target.value,
    );

    setVolumen(nuevoVolumen);

    if (audioRef.current) {
      audioRef.current.volume =
        nuevoVolumen;
    }
  };

  /*
    Los valores del select están expresados
    directamente en segundos.
  */
  const cambiarTemporizador = async (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const valor = event.target.value;

    setTemporizadorSeleccionado(
      valor,
    );

    /*
      La opción vacía cancela
      el temporizador.
    */
    if (valor === '') {
      setTiempoRestanteSegundos(
        null,
      );

      return;
    }

    const segundos = Number(valor);

    setTiempoRestanteSegundos(
      segundos,
    );

    /*
      El reproductor ya aparece únicamente
      cuando existe una pista seleccionada.

      Si estaba pausada, al seleccionar
      un tiempo comienza a reproducirse.
    */
    if (
      currentSonido &&
      audioRef.current?.paused
    ) {
      await reproducirAudioActual();
    }
  };

  /*
    Convierte segundos a:

    05:00
    14:59
    01:00:00
  */
  const formatearTiempo = (
    totalSegundos: number,
  ) => {
    const horas = Math.floor(
      totalSegundos / 3600,
    );

    const minutos = Math.floor(
      (totalSegundos % 3600) / 60,
    );

    const segundos =
      totalSegundos % 60;

    const horasTexto = String(
      horas,
    ).padStart(2, '0');

    const minutosTexto = String(
      minutos,
    ).padStart(2, '0');

    const segundosTexto = String(
      segundos,
    ).padStart(2, '0');

    return horas > 0
      ? `${horasTexto}:${minutosTexto}:${segundosTexto}`
      : `${minutosTexto}:${segundosTexto}`;
  };

  const manejarErrorAudio = () => {
    setIsPlaying(false);

    setAudioError(
      'No fue posible cargar este audio. Comprueba tu conexión o reemplaza su audioUrl.',
    );
  };

  const todosLosSonidos =
    dataAlbumes.flatMap(
      (album) => album.sonidos,
    );

  const sonidosFavoritos =
    todosLosSonidos.filter(
      (sonido) =>
        favoritos.includes(
          sonido.id,
        ),
    );

  return (
    <div className="serenia-dark-theme">
      {/*
        No se coloca src aquí porque la dirección
        se asigna únicamente cuando se cambia
        de tarjeta.

        Así, mover el volumen no vuelve a cargar
        la pista.
      */}
      <audio
        ref={audioRef}
        preload="metadata"
        loop
        onPlay={() => {
          setIsPlaying(true);
        }}
        onPause={() => {
          setIsPlaying(false);
        }}
        onError={manejarErrorAudio}
      />

      <div className="layout-content">
        <header className="header-app centralizado">
          <h1>
            Sonidos Relajantes
          </h1>

          <p className="subtitle">
            Encuentra el sonido perfecto
            para relajarte
          </p>
        </header>

        {/* CONTENEDOR PRINCIPAL DE ÁLBUMES */}
        <main className="albumes-container">
          {dataAlbumes.map(
            (album) => (
              <section
                key={album.id}
                className="album-section"
              >
                <div className="album-header-info">
                  <h2>
                    {album.nombre}
                  </h2>

                  <span className="album-tag">
                    {album.subtitulo}
                  </span>

                  <p className="album-desc">
                    {album.descripcion}
                  </p>
                </div>

                {/* GRID DE TARJETAS */}
                <div className="cards-grid">
                  {album.sonidos.map(
                    (sonido) => {
                      const esActivo =
                        currentSonido?.id ===
                        sonido.id;

                      const esFavorito =
                        favoritos.includes(
                          sonido.id,
                        );

                      return (
                        <article
                          key={sonido.id}
                          className={`sound-card ${
                            esActivo
                              ? 'active-card'
                              : ''
                          }`}
                          style={{
                            backgroundImage: `
                              linear-gradient(
                                rgba(0, 0, 0, 0.5),
                                rgba(0, 0, 0, 0.8)
                              ),
                              url(${sonido.imagenUrl})
                            `,
                          }}
                          onClick={() => {
                            void seleccionarSonido(
                              sonido,
                            );
                          }}
                        >
                          <div className="card-top">
                            <button
                              type="button"
                              className="btn-favorite"
                              aria-label={
                                esFavorito
                                  ? `Quitar ${sonido.titulo} de favoritos`
                                  : `Agregar ${sonido.titulo} a favoritos`
                              }
                              onClick={(
                                event,
                              ) =>
                                handleToggleFavorito(
                                  sonido.id,
                                  event,
                                )
                              }
                            >
                              {esFavorito
                                ? '❤️'
                                : '🤍'}
                            </button>

                            <button
                              type="button"
                              className="btn-play-card"
                              aria-label={
                                esActivo &&
                                isPlaying
                                  ? `Pausar ${sonido.titulo}`
                                  : `Reproducir ${sonido.titulo}`
                              }
                              onClick={(
                                event,
                              ) => {
                                event.stopPropagation();

                                void seleccionarSonido(
                                  sonido,
                                );
                              }}
                            >
                              {esActivo &&
                              isPlaying
                                ? '⏸'
                                : '▶'}
                            </button>
                          </div>

                          <div className="card-body">
                            <h3>
                              {sonido.titulo}
                            </h3>

                            <span className="duration">
                              ⏱{' '}
                              {sonido.duracion}
                            </span>
                          </div>
                        </article>
                      );
                    },
                  )}
                </div>
              </section>
            ),
          )}
        </main>

        {/* PANEL DE HISTORIAL Y FAVORITOS */}
        <aside className="history-panel">
          <div className="panel-section">
            <h3>
              Historial Reciente
            </h3>

            {historial.length === 0 ? (
              <p className="empty-text">
                No has escuchado sonidos
                aún.
              </p>
            ) : (
              <ul className="history-list">
                {historial.map(
                  (item) => (
                    <li
                      key={item.id}
                      className="history-item"
                    >
                      <span className="bullet">
                        ⚡
                      </span>

                      <div className="history-info">
                        <p>
                          {item.titulo}
                        </p>

                        <span className="time">
                          {item.fecha}
                        </span>
                      </div>
                    </li>
                  ),
                )}
              </ul>
            )}
          </div>

          <div className="panel-section favorites-section">
            <h3>
              Mis Favoritos ❤️
            </h3>

            {sonidosFavoritos.length ===
            0 ? (
              <p className="empty-text">
                No tienes sonidos marcados
                como favoritos.
              </p>
            ) : (
              <ul className="history-list">
                {sonidosFavoritos.map(
                  (sonidoFavorito) => (
                    <li
                      key={
                        sonidoFavorito.id
                      }
                      className="history-item fav-item-clickable"
                      onClick={() => {
                        void seleccionarSonido(
                          sonidoFavorito,
                        );
                      }}
                    >
                      <span className="bullet">
                        🎵
                      </span>

                      <div className="history-info">
                        <p>
                          {
                            sonidoFavorito.titulo
                          }
                        </p>

                        <span className="time">
                          {
                            sonidoFavorito.duracion
                          }
                        </span>
                      </div>
                    </li>
                  ),
                )}
              </ul>
            )}
          </div>
        </aside>

        {/* REPRODUCTOR FLOTANTE */}
        {currentSonido && (
          <footer className="floating-player">
            <div className="player-track">
              <span className="disc-icon">
                💿
              </span>

              <div>
                <h4>
                  {currentSonido.titulo}
                </h4>

                <p className="status">
                  {isPlaying
                    ? 'Reproduciendo...'
                    : 'En pausa'}
                </p>

                {audioError && (
                  <p className="audio-error">
                    {audioError}
                  </p>
                )}
              </div>
            </div>

            <div className="player-controls-row">
              <button
                type="button"
                className="btn-main-play"
                aria-label={
                  isPlaying
                    ? 'Pausar reproducción'
                    : 'Continuar reproducción'
                }
                onClick={() => {
                  void alternarReproduccion();
                }}
              >
                {isPlaying ? '⏸' : '▶'}
              </button>

              <div
                className="volume-slider-container"
                onClick={(event) => {
                  event.stopPropagation();
                }}
                onPointerDown={(event) => {
                  event.stopPropagation();
                }}
              >
                <span>🔈</span>

                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volumen}
                  aria-label="Volumen"
                  onChange={cambiarVolumen}
                />

                <span>🔊</span>
              </div>

              <div
                className="timer-dropdown-container"
                onClick={(event) => {
                  event.stopPropagation();
                }}
              >
                <span>⏱️</span>

                <select
                  value={
                    temporizadorSeleccionado
                  }
                  aria-label="Temporizador"
                  onChange={(event) => {
                    void cambiarTemporizador(
                      event,
                    );
                  }}
                >
                  <option value="">
                    Temporizador
                  </option>

                  <option value="60">
                    1 minuto
                  </option>

                  <option value="300">
                    5 minutos
                  </option>

                  <option value="900">
                    15 minutos
                  </option>

                  <option value="1800">
                    30 minutos
                  </option>

                  <option value="3600">
                    60 minutos
                  </option>
                </select>

                {tiempoRestanteSegundos !==
                  null && (
                  <span className="countdown">
                    {formatearTiempo(
                      tiempoRestanteSegundos,
                    )}
                  </span>
                )}
              </div>
            </div>
          </footer>
        )}
      </div>
    </div>
  );
};