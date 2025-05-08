export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">FurniCraft</h3>
            <p className="text-gray-300">Quality furniture for every home and office.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <p className="text-gray-300">Pitipana</p>
            <p className="text-gray-300">Thalagala Rd, Homagama</p>
            <p className="text-gray-300">contactdinitha@furnicraft.com</p>
            <p className="text-gray-300">+94 77 063 7731</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white">Instagram</a>
              <a href="#" className="text-gray-300 hover:text-white">Facebook</a>
              <a href="#" className="text-gray-300 hover:text-white">Twitter</a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-300">
          <p>© 2023 FurniCraft. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
} 