const Card = ({ title, children, footer, className = "" }) => {
  return (
    <div className={`bg-white rounded-xl shadow-md p-6 space-y-4 ${className}`}>
      {title && <h3 className="text-lg font-semibold text-gray-800">{title}</h3>}
      <div className="text-gray-700">{children}</div>
      {footer && <div className="pt-4 border-t text-sm text-gray-500">{footer}</div>}
    </div>
  );
};

export default Card;
