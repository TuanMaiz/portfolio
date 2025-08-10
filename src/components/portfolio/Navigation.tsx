interface NavigationProps {
  sections: {
    id: string;
    label: string;
  }[];
}

export default function Navigation({ sections }: NavigationProps) {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed top-8 right-8 z-50 hidden lg:block">
      <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg px-4 py-3 shadow-sm">
        <ul className="space-y-2">
          {sections.map((section) => (
            <li key={section.id}>
              <button
                onClick={() => scrollToSection(section.id)}
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200 block w-full text-left"
              >
                {section.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}