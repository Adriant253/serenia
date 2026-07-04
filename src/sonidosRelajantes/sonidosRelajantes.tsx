import "./SonidosRelajantes.css";

function SonidosRelajantes() {
  return (
    <div className="sonidos-container">
      {/* Hero */}
      <header className="sonidos-hero">
        <h1 className="sonidos-titulo">Sonidos Relajantes</h1>
        <p className="sonidos-subtitulo">
          Encuentra el sonido perfecto para relajarte
        </p>
        <div className="sonidos-actions">
          <input
            type="text"
            placeholder="Buscar sonidos..."
            className="sonidos-search"
          />
          <button className="sonidos-notif">🔔</button>
        </div>
      </header>

      {/* Tabs */}
      <nav className="sonidos-tabs">
        <button className="sonidos-tab active">Biblioteca</button>
        <button className="sonidos-tab">Recomendados</button>
        <button className="sonidos-tab">Favoritos</button>
        <button className="sonidos-tab">Sesión rápida</button>
      </nav>

      {/* Reproductor */}
      <section className="sonidos-player">
        <div className="player-info">
          <h3>🌊 Sonidos de mar relajantes</h3>
          <p>Audio ambiental · 10:00</p>
        </div>
        <div className="player-bar">
          <button>⏯️</button>
          <div className="player-progress">
            <div className="player-progress-fill" style={{ width: "45%" }}></div>
          </div>
          <span>4:30 / 10:00</span>
        </div>
      </section>

      {/* Álbumes */}
      <section className="sonidos-album">
        <h2 className="album-titulo">🌿 Santuario Natural</h2>
        <p className="album-subtitulo">(Naturaleza y Agua)</p>
        <div className="album-list">
          <div className="sonido-card">
            <h4>🌧️ Lluvia tranquila</h4>
            <p>Sonido de lluvia ligera para estudiar o descansar.</p>
            <span className="sonido-duracion">08:45</span>
          </div>
          <div className="sonido-card">
            <h4>🌲 Bosque en calma</h4>
            <p>Aves, viento suave y ambiente natural relajante.</p>
            <span className="sonido-duracion">12:20</span>
          </div>
        </div>
      </section>

      <section className="sonidos-album">
        <h2 className="album-titulo">🌙 Sueño Infinito</h2>
        <p className="album-subtitulo">(Para Dormir y Descanso Profundo)</p>
        <div className="album-list">
          <div className="sonido-card">
            <h4>🌌 Noche estrellada</h4>
            <p>Ambiente nocturno para mejorar tu sueño.</p>
            <span className="sonido-duracion">20:00</span>
          </div>
          <div className="sonido-card">
            <h4>💤 Meditación profunda</h4>
            <p>Frecuencias suaves para meditación y calma.</p>
            <span className="sonido-duracion">18:30</span>
          </div>
        </div>
      </section>
    </div>
  );
}

export default SonidosRelajantes;
