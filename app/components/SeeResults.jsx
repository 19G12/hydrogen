import { Section } from "./Text";

export function SeeResults({seeResults}){
    return(
        <Section className="banner-wrap">
          <div
            className="text-black	"
            dangerouslySetInnerHTML={{ __html: seeResults.value }}
          />
        </Section>
    )
}