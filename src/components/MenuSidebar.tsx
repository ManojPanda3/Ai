const MenuSidebar = ({ setIsMenuOpen }) => {
  function handleMenuClose(e: any) {
    const child = e.target.children[0];
    if (!child) return;
    e.target.classList.remove('animate-slideIn');
    e.target.classList.add('animate-slideOut');
    setTimeout(() => {
      setIsMenuOpen(false);
    }, 300);
  }
  return (
    <section
      className={"h-screen w-full absolute z-1 top-0 left-0 bg-[rgba(20,20,20,0.4)] flex "}
      onMouseDown={handleMenuClose}
    >
      <div className={"h-full w-[70vw] bg-zinc-800 animate-slideIn max-w-[400px]"}>
      </div>
    </section>
  )
}

export default MenuSidebar
