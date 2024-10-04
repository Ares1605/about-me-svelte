# Svelte Typer - About Me Page

This project is a personal "About Me" page built with Svelte and Vite, featuring an impressive typer component that imitates keyboard typing with a cursor effect.

## Features

- Responsive "About Me" page
- Custom typer component with realistic typing animation
- Built with Svelte for efficient, reactive UI
- Vite for fast development and optimized production builds

## Typer Component

The star of this project is the custom typer component. It simulates typing text with a blinking cursor, creating a dynamic and engaging user experience. Key features include:

- Customizable typing speed
- Randomizing of typing throughout lines
- Realistic cursor blink effect
  
## Getting Started

### Prerequisites

- Node.js (version 14 or later recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/Ares1605/about-me-svelte.git
   ```

2. Navigate to the project directory:
   ```
   cd about-me-svelte
   ```

3. Install dependencies:
   ```
   npm install
   ```

### Development

Run the development server:

```
npm run dev
```

This will start the development server, usually at `http://localhost:3000`.

### Building for Production

To create a production-ready build:

```
npm run build
```

This will generate optimized assets in the `dist` directory.

## Usage

To use the Typer component in your Svelte files:

```svelte
<script>
  import Typer from "./Typer.svelte";
</script>
<Typer
  delayMultiplier={.4}
  justify={"left"}
  cursorStay={false}
  cursorBlink={false}
>
    text
</Typer>
```

Adjust the props as needed:
- `text`: The text to be typed
- `delayMultiplier`: Speed multiplier of the typing
- `justify`: Enforced text justification styling
- `cusrorStay`: Whether to keep the cursor after the typing is complete
- `cursorBlink`: Whether the cursor should blink during typing
