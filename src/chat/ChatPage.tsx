import ChatAutoayuda from '../estadoAnimo/components/ChatAutoayuda'

import '../estadoAnimo/ChatAutoayuda.css'
import './ChatPage.css'

function ChatPage() {
  return (
    <div className="chat-page">
      <header className="chat-page-hero">
        <h1>Asistente Serenia</h1>
        <p>
          Cuéntame qué pasa en tu jornada laboral.
          Respondo de forma distinta según lo que
          escribas: estrés, reuniones, carga de
          trabajo, ansiedad y más.
        </p>
      </header>

      <ChatAutoayuda variant="page" />
    </div>
  )
}

export default ChatPage
