import WindowFrame from '../components/ui/WindowFrame';

export default function Login() {
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-sky-200">
      <div className="w-[350px] h-[550px]">
        <WindowFrame title="Entrar">
          {/* Aqui entrariam os inputs de login que faremos depois */}
          <div className="p-10 flex flex-col items-center">
             <img src="/images/default-avatar.png" className="w-24 h-24 mb-4" />
             <input className="msn-input w-full mb-2" placeholder="Nome da Delegação" />
             {/* ... */}
          </div>
        </WindowFrame>
      </div>
    </div>
  );
}
