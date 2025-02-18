let timer: number;

export const resizeObserverFn =
  (inputElement: HTMLTextAreaElement, outputElement: HTMLTextAreaElement) =>
  (entries: ResizeObserverEntry[], observer: ResizeObserver) => {
    debounce();
    function debounce() {
      clearTimeout(timer);
      timer = setTimeout(() => {
        entries.forEach((entry) => {
          const newHeight = entry.contentRect.height;
          const subjectTextArea = entry.target as HTMLTextAreaElement;
          if (subjectTextArea === inputElement) {
            outputElement.style.height = `${newHeight}px`;
          }
          if (subjectTextArea === outputElement) {
            inputElement.style.height = `${newHeight}px`;
          }
        });
      }, 50);
    }
  };
