# Clone AI

This project is a monorepo using Turborepo, containing a Next.js web application and a shared database package.

## Getting Started

1.  **Install Dependencies:**

    ```bash
    pnpm install
    ```
2. **Add env's**
- All env keys are mentioned [turbo.json](./turbo.json)


3.  **Set up the Database:**

    ```bash
    pnpm prisma migrate dev
    ```

3.  **Start Application:**

    ```bash
    pnpm dev
    ```

    The app will be available at `http://localhost:3000`.

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests to improve the project.

## License

This project is licensed under the [MIT License](LICENSE).

---

Happy coding!