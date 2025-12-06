import ProgramCard from "../ProgramCard";
import growImage from "@assets/generated_images/grow_program_youth_training.png";

export default function ProgramCardExample() {
  return (
    <div className="max-w-sm p-4 bg-night">
      <ProgramCard
        type="grow"
        title="Grow"
        ageRange="Ages 5-8"
        description="Where young players discover the joy of soccer through fun, skill-building activities."
        features={[
          "Fundamental ball skills",
          "Coordination & movement",
          "Team play introduction",
        ]}
        imageSrc={growImage}
        onLearnMore={() => console.log("Learn more about Grow")}
      />
    </div>
  );
}
