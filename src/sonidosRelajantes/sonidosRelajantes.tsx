import React, { useState, useEffect, useRef } from 'react';
import './sonidosRelajantes.css';

interface Sonido {
  id: number;
  titulo: string;
  duracion: string;
  audioUrl?: string; // nombre columna audio_url de Cloud SQL
  imagenUrl: string; // nombre columna imagen_url de Cloud SQL
}

interface Album {
  id: number;
  nombre: string;
  subtitulo: string;
  descripcion: string;
  sonidos: Sonido[];
}

export const SonidosRelajantes: React.FC = () => {
  // Estructura de imágenes de naturaleza y relajación
  const dataAlbumes: Album[] = [
    {
      id: 1,
      nombre: 'Santuario Natural',
      subtitulo: 'Naturaleza y Agua',
      descripcion: 'Enfocado en sonidos de lluvia, ríos, olas del mar y bosques.',
      sonidos: [
        { id: 1, titulo: 'Ecos de la Lluvia', duracion: '12:00', imagenUrl: 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?q=80&w=400' },
        { id: 2, titulo: 'Mareas de Serenidad', duracion: '15:30', imagenUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=400' },
        { id: 3, titulo: 'Ríos de Calma', duracion: '10:00', imagenUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=400' },
        { id: 4, titulo: 'El Latido del Bosque', duracion: '20:00', imagenUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=400' },
      ]
    },
    {
      id: 2,
      nombre: 'Sueño Infinito',
      subtitulo: 'Para Dormir y Descanso Profundo',
      descripcion: 'Sonidos de frecuencias bajas, sutiles y constantes que ayudan a apagar la mente por la noche.',
      sonidos: [
        { id: 5, titulo: 'Sueño Profundo', duracion: '30:00', imagenUrl: 'https://i.pinimg.com/1200x/27/71/de/2771de7bfa1cb1aba3362dd5e1fe752c.jpg' },
        { id: 6, titulo: 'Descanso Absoluto', duracion: '30:00', imagenUrl: 'https://i.pinimg.com/736x/dc/5d/46/dc5d464845143e5457973ba749c6aa6c.jpg' },
        { id: 7, titulo: 'Calma Eterna', duracion: '30:00', imagenUrl: 'https://i.pinimg.com/1200x/5b/a0/a4/5ba0a4e8f9fb2f46faebe69cfdcd36b0.jpg' },
        { id: 8, titulo: 'Tranquilidad Infinita', duracion: '30:00', imagenUrl: 'https://i.pinimg.com/736x/a3/9e/78/a39e786234640be42f0e0c575c5259d3.jpg' },
      ]
    },
    {
      id: 3,
      nombre: 'Refugio Cálido',
      subtitulo: 'Enfoque y Trabajo',
      descripcion: 'Sonidos continuos como ruido blanco, lluvia en una ventana o murmullos de paz.',
      sonidos: [
        { id: 9, titulo: 'Espacio de Enfoque', duracion: '45:00', imagenUrl: 'https://i.pinimg.com/1200x/fe/42/fe/fe42feb33aaa3ff5f0e02847c88b28c3.jpg' },
        { id: 10, titulo: 'Frecuencias Claras', duracion: '15:00', imagenUrl: 'https://i.pinimg.com/1200x/09/e6/37/09e637df7344a51b123e3e6df4b52b31.jpg' },
        { id: 11, titulo: 'Mente En Calma', duracion: '10:00', imagenUrl: 'https://i.pinimg.com/736x/7d/f4/e1/7df4e1482a00a63f58fb72cd353ad2af.jpg' },
        { id: 12, titulo: 'Tormenta Lejana', duracion: '30:00', imagenUrl: 'https://cdn.pixabay.com/photo/2012/12/20/10/13/thunderstorm-71366_640.jpg' }
      ]
    },
    {
      id: 4,
      nombre: 'Espacio Interior',
      subtitulo: 'Meditación y Espiritualidad',
      descripcion: 'Tonos de cuencos tibetanos, campanas sutiles.',
      sonidos: [
        { id: 13, titulo: 'El Viaje Interior', duracion: '11:11', imagenUrl: 'https://i.pinimg.com/1200x/84/e9/14/84e914d5aa010475c6b39d1a545a6ae8.jpg' },
        { id: 14, titulo: 'Despertar Silencioso', duracion: '14:00', imagenUrl: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?q=80&w=400' },
        { id: 15, titulo: 'Claridad Mental', duracion: '10:00', imagenUrl: 'https://i.pinimg.com/736x/a3/4d/93/a34d93ce3a78e0e2bc9f97a4c08c99a5.jpg' },
        { id: 16, titulo: 'Luz Sutil', duracion: '08:45', imagenUrl: 'https://img.magnific.com/foto-gratis/puesta-sol-playa-ai-generada_268835-11222.jpg?semt=ais_hybrid&w=740&q=80' },
      ]
    },
    {
      id: 5,
      nombre: 'Silencio Cósmico',
      subtitulo: 'Concentración profunda',
      descripcion: 'Deriva Estelar (Pequeños ecos brillantes que estimulan la creatividad o la calma).',
      sonidos: [
        { id: 17, titulo: 'Eco y Reverberación Infinita', duracion: '60:00', imagenUrl: 'https://i.pinimg.com/1200x/78/2f/71/782f71e1057f77110fd22e94ad19626d.jpg' },
        { id: 18, titulo: 'Variaciones de Ruido Marrón y Gris', duracion: '30:00', imagenUrl: 'https://i.pinimg.com/736x/99/c0/a3/99c0a3c5b9c4cebf4a6090ba3bfb7848.jpg' },
        { id: 19, titulo: 'Pads de Cristal y Texturas Heladas', duracion: '25:00', imagenUrl: 'https://i.pinimg.com/736x/99/c0/a3/99c0a3c5b9c4cebf4a6090ba3bfb7848.jpg' },
        { id: 20, titulo: 'Pulsos Binaurales Profundos', duracion: '40:00', imagenUrl: 'https://i.pinimg.com/1200x/35/43/a3/3543a354c48f5f3ba98bef3ffedeeb28.jpg' },
      ]
    }
  ];

  const [currentSonido, setCurrentSonido] = useState<Sonido | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volumen, setVolumen] = useState<number>(0.5);
  const [tiempoRestante, setTiempoRestante] = useState<number | null>(null);
  const [historial, setHistorial] = useState<any[]>([]);
  
  // Estado de Favoritos
  const [favoritos, setFavoritos] = useState<number[]>([]);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const localHistorial = localStorage.getItem('serenia_historial');
    if (localHistorial) setHistorial(JSON.parse(localHistorial));

    const localFavoritos = localStorage.getItem('serenia_favoritos');
    if (localFavoritos) setFavoritos(JSON.parse(localFavoritos));
  }, []);

  useEffect(() => {
    if (tiempoRestante === null) return;
    if (tiempoRestante <= 0) {
      setIsPlaying(false);
      setTiempoRestante(null);
      return;
    }
    const timerInterval = setInterval(() => {
      setTiempoRestante(prev => (prev !== null ? prev - 1 : null));
    }, 60000);

    return () => clearInterval(timerInterval);
  }, [tiempoRestante]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => console.log("Carga un archivo de audio real"));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentSonido]);

  const seleccionarSonido = (sonido: Sonido) => {
    if (currentSonido?.id === sonido.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentSonido(sonido);
      setIsPlaying(true);
      actualizarHistorial(sonido);
    }
  };

  const actualizarHistorial = (sonido: Sonido) => {
    const nuevoRegistro = {
      id: sonido.id,
      titulo: sonido.titulo,
      fecha: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    const nuevoHistorial = [nuevoRegistro, ...historial.filter(h => h.id !== sonido.id)].slice(0, 5);
    setHistorial(nuevoHistorial);
    localStorage.setItem('serenia_historial', JSON.stringify(nuevoHistorial));
  };

  // Guardar/Quitar favoritos con LocalStorage
  const handleToggleFavorito = (sonidoId: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Evita reproducir al marcar favorito
    let nuevosFavoritos;
    if (favoritos.includes(sonidoId)) {
      nuevosFavoritos = favoritos.filter(id => id !== sonidoId);
    } else {
      nuevosFavoritos = [...favoritos, sonidoId];
    }
    setFavoritos(nuevosFavoritos);
    localStorage.setItem('serenia_favoritos', JSON.stringify(nuevosFavoritos));
  };

  return (
    <div className="serenia-dark-theme">
      <audio 
        ref={audioRef} 
        src={currentSonido?.audioUrl || "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"} 
        loop
      />

      <div className="layout-content">
        <header className="header-app centralizado">
  <h1>Sonidos Relajantes</h1>
  <p className="subtitle">Encuentra el sonido perfecto para relajarte</p>
</header>

        {/* CONTENEDOR PRINCIPAL DE ÁLBUMES */}
        <div className="albumes-container">
          {dataAlbumes.map((album) => (
            <div key={album.id} className="album-section">
              <div className="album-header-info">
                <h2>{album.nombre}</h2>
                <span className="album-tag">{album.subtitulo}</span>
                <p className="album-desc">{album.descripcion}</p>
              </div>

              {/* GRID DE CARDS DEL ÁLBUM CON IMÁGENES */}
              <div className="cards-grid">
                {album.sonidos.map((sonido) => {
                  const esActivo = currentSonido?.id === sonido.id;
                  const esFavorito = favoritos.includes(sonido.id);
                  return (
                    <div 
                      key={sonido.id} 
                      className={`sound-card ${esActivo ? 'active-card' : ''}`}
                      style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.8)), url(${sonido.imagenUrl})` }}
                    >
                      <div className="card-top">
                        <button className="btn-favorite" onClick={(e) => handleToggleFavorito(sonido.id, e)}>
                          {esFavorito ? '❤️' : '🤍'}
                        </button>
                        <button className="btn-play-card" onClick={() => seleccionarSonido(sonido)}>
                          {esActivo && isPlaying ? '⏸' : '▶'}
                        </button>
                      </div>
                      <div className="card-body">
                        <h3>{sonido.titulo}</h3>
                        <span className="duration">⏱ {sonido.duracion}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* SECCIÓN LATERAL DERECHA UNIFICADA (HISTORIAL + FAVORITOS) */}
        <aside className="history-panel">
          <div className="panel-section">
            <h3>Historial Reciente</h3>
            {historial.length === 0 ? (
              <p className="empty-text">No has escuchado sonidos aún.</p>
            ) : (
              <ul className="history-list">
                {historial.map((item, index) => (
                  <li key={index} className="history-item">
                    <span className="bullet">⚡</span>
                    <div className="history-info">
                      <p>{item.titulo}</p>
                      <span className="time">{item.fecha}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* NUEVO REQUERIMIENTO: SECCIÓN FAVORITOS SEPARADA ABAJO */}
          <div className="panel-section favorites-section">
            <h3>Mis Favoritos ❤️</h3>
            {favoritos.length === 0 ? (
              <p className="empty-text">No tienes sonidos marcados como favoritos.</p>
            ) : (
              <ul className="history-list">
                {dataAlbumes.flatMap(a => a.sonidos)
                  .filter(s => favoritos.includes(s.id))
                  .map((favTrack) => (
                    <li key={favTrack.id} className="history-item fav-item-clickable" onClick={() => seleccionarSonido(favTrack)}>
                      <span className="bullet">🎵</span>
                      <div className="history-info">
                        <p>{favTrack.titulo}</p>
                        <span className="time">{favTrack.duracion}</span>
                      </div>
                    </li>
                ))}
              </ul>
            )}
          </div>
        </aside>

        {/* REPRODUCTOR FLOTANTE INFERIOR FIJO */}
        {currentSonido && (
          <footer className="floating-player">
            <div className="player-track">
              <span className="disc-icon">💿</span>
              <div>
                <h4>{currentSonido.titulo}</h4>
                <p className="status">{isPlaying ? 'Reproduciendo...' : 'En pausa'}</p>
              </div>
            </div>

            <div className="player-controls-row">
              <button className="btn-main-play" onClick={() => setIsPlaying(!isPlaying)}>
                {isPlaying ? '⏸' : '▶'}
              </button>

              <div className="volume-slider-container">
                <span>🔈</span>
                <input 
                  type="range" min="0" max="1" step="0.1" 
                  value={volumen} 
                  onChange={(e) => {
                    const v = parseFloat(e.target.value);
                    setVolumen(v);
                    if (audioRef.current) audioRef.current.volume = v;
                  }} 
                />
                <span>🔊</span>
              </div>

              <div className="timer-dropdown-container">
                <span>⏱️</span>
                <select value={tiempoRestante || ""} onChange={(e) => setTiempoRestante(Number(e.target.value) || null)}>
                  <option value="">Temporizador</option>
                  <option value="1">1 min</option>
                  <option value="15">15 min</option>
                  <option value="30">30 min</option>
                  <option value="60">60 min</option>
                </select>
                {tiempoRestante !== null && (
                  <span className="countdown">({tiempoRestante}m)</span>
                )}
              </div>
            </div>
          </footer>
        )}
      </div>
    </div>
  );
};
