import './Footer.css'

export function Footer() {
  return (
    <footer className="site-footer">
      <img
        src={`${import.meta.env.BASE_URL}images/logo-simbolo.png`}
        alt="Símbolo Volatille"
        width={110}
        height={110}
      />
      <p className="site-footer__brand">Volatille</p>
      <p className="site-footer__motto">Aromas que acolhem</p>
    </footer>
  )
}
