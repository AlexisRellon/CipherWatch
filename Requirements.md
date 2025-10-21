# Project Requirements

## Description

CipherWatch is a Bank Fraud Detection SaaS Application. The model will accept the following features:

- Transaction Type {Payment, Cash in, Cash Out, Transfer, Debit}
- Transaction Amount
- Origin Account {Old Balance, New Balance}
- Destination Account {Old Balance, New Balance}

## Front-end


The entire application interface must mimic a CLI (Command Line Interface) look and feel (LAF).

The GUI should use ASCII characters and layout to simulate a real interactive CLI, covering the whole page.

Retain the starting boot sequence animation on page load.

No zoom-in effect should be present anywhere in the UI.

Globally use JetBrains Mono or similar monospaced font for all text and CLI elements.

Icons and Logo: Use the logo found in `/resources/icon/` directory for branding and boot sequence.

**Important**: Below is the directory structure for the icons that will be used as assets and favicon for the application.
```ps
# Icon Directory to be used
/resources/
    /icon/
        Icon-*.png
        Logo-*.png
```

### User Story

1. Upon page load, the background will fade-in then simulate a startup boot sequence on the screen using the logo in `/resources/icon/` directory. On the next sequence the monitor will zoom in to filling the page around 80% 'like the user is now in focus on the monitor.'

2. After boot, user can now input required details.

3. After all the fields are filled, the user click the `Analyze Transaction` <-- "You can edit the button name for better UX."

4. The model will now predict based on the fields entered then display necessary information if the transaction is `fraud` or `not fraud`.

5. User can navigate to the next page to view the model details (e.g. Model Algorithm, performance metrics, etc.) You can refer to `Sample-LoFi-ui-design_structure.png` as your reference.

### Component Based

Create components for reusability.

### Styling

Utilized Tailwind CSS and CDN which is already setup on the `index.html`.

Create custom styling for complex design.

## Back-end

Ensure CORS is enabled for API Calling.

Use the `/Backend/` Directory.

### API Endpoints

- `POST /predict` - Accepts transaction details and returns prediction result.
- `GET /model-details` - Returns information about the model used for predictions.

### Model Integration

Integrate the pre-trained fraud detection model located in the `/model/` directory.

Ensure the model is loaded once at server startup for efficiency.

### Error Handling

Implement error handling for invalid inputs and server errors. Return appropriate HTTP status codes and messages.

## Testing

Perform unit tests for both front-end and back-end components.
Conduct integration tests to ensure seamless communication between front-end and back-end.