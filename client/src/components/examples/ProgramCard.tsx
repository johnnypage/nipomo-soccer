import ProgramCard from "../ProgramCard";
import rootsImage from "@assets/generated_images/grow_program_youth_training.png";
import rootsLogo from "@assets/NSC_Roots_1764979848772.png";

export default function ProgramCardExample() {
  return (
    <div className="max-w-sm p-4 bg-night">
      <ProgramCard
        type="roots"
        title="Roots"
        ageRange="Ages 5-8"
        description="Where young players discover the joy of soccer through fun, skill-building activities."
        features={[
          "Fundamental ball skills",
          "Coordination & movement",
          "Team play introduction",
        ]}
        imageSrc={rootsImage}
        logoSrc={rootsLogo}
        onLearnMore={() => console.log("Learn more about Roots")}
      />
    </div>
  );
}
