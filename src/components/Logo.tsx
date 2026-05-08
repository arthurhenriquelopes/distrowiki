interface LogoProps {
  className?: string;
}

const Logo = ({ className = "" }: LogoProps) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img 
        src="/newlogo.png" 
        alt="Logo" 
        className="w-16 h-16 sm:w-20 sm:h-20 object-contain"
      />
      
      <div className="text-xl leading-none font-bold tracking-tight">
        <span className="text-primary">Distro</span>
        <span className="text-foreground">Wiki</span>
      </div>
    </div>
  );
};

export default Logo;