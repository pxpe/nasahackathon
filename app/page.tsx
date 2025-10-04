import Globe from '../components/Globe'

export default function HomePage() {
  return (
    <main className="relative w-full h-screen overflow-hidden">
      {/* Header fijo */}
      <header className="absolute top-0 left-0 w-full p-6 flex gap-5 justify-start items-center z-30 pointer-events-none bg-black/10 backdrop-blur-sm">
        <div>
          <img src="/images/logo.jpg" alt="Treesar Logo" className="w-16 h-16 rounded pointer-events-auto" />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-white drop-shadow-lg">TreeSAR</h1>
          <h3 className="text-lg text-green-300 drop-shadow-md mt-1">Deforestation Analysis through the use of SAR technologies</h3>
        </div>

      </header>

      {/* Canvas 3D */}
      <Globe />
    </main>
  )
}
