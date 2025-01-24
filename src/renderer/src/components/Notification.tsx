
interface NotificationModalProps {
  message: string;
  onClose: () => void;
}

function Notification({ message, onClose }:NotificationModalProps) : JSX.Element {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
        <p className="text-2xl font-semibold mb-4 text-gray-800">{message}</p>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Notification;
