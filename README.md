# EnvVault

EnvVault is a modern, secure, and efficient way to manage your environment variables across multiple projects and environments. Built with Next.js 16 and Tailwind CSS, it offers a beautiful interface to organize, compare, and sync your secrets without the hassle of manual file management.

![EnvVault Preview](public/preview.png)
> *Note: Add a screenshot of your dashboard here*

## Features

- **Project Management**: Create and track multiple projects with dedicated environments.
- **Multi-Environment Support**: Seamlessly manage variables for Development, Staging, and Production.
- **Smart Variable Management**:
  - Add, Edit, and Delete variables.
  - **Batch Import**: Upload `.env` files or paste content to import multiple variables at once.
  - **Search & Filter**: Instantly find the keys you need.
- **Sync & Compare**:
  - **Diff View**: Compare environments side-by-side to spot missing keys or value mismatches.
  - **One-Click Sync**: Push variables from one environment to another with a single click.
- **Modern UI**: Fully responsive Dark Mode interface built with Tailwind CSS v4 and DaisyUI.
- **Local-First**: Powered by SQLite & Prisma, ensuring your data stays on your machine during development.

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [SQLite](https://www.sqlite.org/) via [Prisma ORM](https://www.prisma.io/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) & [DaisyUI](https://daisyui.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Notifications**: [React Hot Toast](https://react-hot-toast.com/)

## Getting Started

Follow these steps to set up the project locally.

### Prerequisites

- Node.js 18+ installed
- npm, pnpm, or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/saianikethreddyp/Envvault.git
   cd env-vault
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Setup Database**
   Initialize the SQLite database and generate the Prisma client.
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Contributing

Contributions are welcome! If you have suggestions or want to improve EnvVault, feel free to fork the repo and submit a Pull Request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.
