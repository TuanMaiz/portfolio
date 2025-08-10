interface ContactInfoProps {
  email: string;
  location: string;
  cvUrl?: string;
  socialLinks?: {
    github?: string;
    twitter?: string;
    linkedin?: string;
  };
}

export default function ContactInfo({ 
  email, 
  location, 
  cvUrl, 
  socialLinks 
}: ContactInfoProps) {
  return (
    <section className="mb-12 pb-8 border-b border-gray-200">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-col md:flex-row md:items-center gap-4 text-gray-600">
          <a 
            href={`mailto:${email}`}
            className="hover:text-gray-900 transition-colors duration-200"
          >
            {email}
          </a>
          <span className="hidden md:block text-gray-400">•</span>
          <span>{location}</span>
        </div>
        
        <div className="flex items-center gap-6">
          {cvUrl && (
            <a
              href={cvUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              CV
            </a>
          )}
          
          {socialLinks?.github && (
            <a
              href={socialLinks.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              GitHub
            </a>
          )}
          
          {socialLinks?.twitter && (
            <a
              href={socialLinks.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              Twitter
            </a>
          )}
          
          {socialLinks?.linkedin && (
            <a
              href={socialLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              LinkedIn
            </a>
          )}
        </div>
      </div>
    </section>
  );
}