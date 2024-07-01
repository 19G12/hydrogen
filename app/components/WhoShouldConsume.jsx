import { Section } from "./Text";

export function WhoShouldConsume({whoShouldConsume}){
    return(
        <Section className="banner-wrap">
          <div
            className="text-black	"
            dangerouslySetInnerHTML={{ __html: whoShouldConsume.value }}
          />
        </Section>
    )
}