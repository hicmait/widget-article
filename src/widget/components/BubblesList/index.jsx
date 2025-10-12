import { Bubble } from "./Bubble";

export function BubblesList({ bubbles }) {
  return (
    <ul>
      {bubbles.map((bubble, index) => {
        return (
          <li key={`bubble-${index}`}>
            <Bubble bubble={bubble} />
          </li>
        );
      })}
    </ul>
  );
}
