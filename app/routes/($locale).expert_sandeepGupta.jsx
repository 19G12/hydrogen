export default function ExpertTestimony() {
  const expertSay = {
    name: 'An Egg',

    introduction:
      ' passion Man is a Nutraceutical Evangelist & Strategist, Influencer, Global Speaker, Panelist, Chief Mentor, Executive Coach of the Nutraceutical Industry. A Pharmaceutical Graduate, currently associated as distinguished Member of Leadership Excellence at Harvard Square, USA. He has been coached by John Mattone (coach of Steve Jobs) & is also a certified Intelligent Leadership Coach, mentoring the Top Management',

    more_about:
      'His leadership dynamism is over 25 years of extensive experience with Pharmaceuticals & Nutraceuticals in Multihued functions like Strategy, Marketing, Legal, Regulatory and Government relations. He has launched 400+ Products and has evaluated 1000+ ingredients. He is the Strategist, mentoring National Wellness Project, along with Bollywood Celebrities and sports clout with integrated due diligence with Strict compliance of Clean, Safe & Qualified Nutrition. He is also spearheading International Alliances to bring World class Nutritional products to India. He is the Chief Founder & Director of the First and the only Nutraceutical Council, Expert Nutraceutical Advocacy Council (ENAC®) leading with 150+ experts. He is also the Chairman - Standard Review Group, Nutraceuticals, FSSAI, Agile Global Spokesperson for Healthcare & Food Industry Globally. His recent achievements being the First & the only Indian on Executive Advisory Board at Informa Exhibitions (Vitafoods & Supply Side), Panelist Judge for Nutraceutical Ingredients Asia Awards since 2018 and has recently appeared in the list of 100 top Achievers - leading with excellence globally.',

    image_url:
      'https://media.istockphoto.com/id/1157804675/photo/brown-eggs-in-a-plate.jpg?s=612x612&w=0&k=20&c=oIUA_5Qu75uZ7wXU-hPNsm6H_D2_hWOG_achilrFvas=',
  };

  const {name, introduction, image_url} = expertSay;

  return (
    <div className="w-full h-screen flex flex-col justify-start items-center pt-20 bg-white text-[#2D2A2A] ">
      <div className="w-10/12 relative flex flex-col justify-center items-center shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] rounded-xl bg-red-300	">
        <div className="w-full">
          <div className="flex flex-row justify-center items-center	p-2 w-full h-full rounded-xl ">
            <img
              src={image_url}
              alt="expert_image"
              className="w-3/12 rounded-2xl absolute -top-5 -left-3 border-[4px] border-solid	border-white shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]"
            />
            <div className="bg-yellow-400 w-8 h-8 absolute -top-2 -right-2 rounded-full flex flex-col justify-center items-center shadow-[rgba(6,_24,_44,_0.4)_0px_0px_0px_2px,_rgba(6,_24,_44,_0.65)_0px_4px_6px_-1px,_rgba(255,_255,_255,_0.08)_0px_1px_0px_inset]"></div>            
            <div className="w-full flex flex-col pt-6 justify-end items-end bg-red-300 rounded-t-xl">
              <div className="w-9/12 p-4 text-center ">
                <h2 className="py-2 text-3xl font-bold ">Hi I'm {name}</h2>
                <p className="text-base">
                  <span className="text-xl font-bold">Mr. Egg,</span>{' '}
                  {introduction}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full flex flex-col pb-6 justify-end items-end bg-red-300 rounded-b-xl">
          <div className="w-full p-4 text-center ">
            <h2 className="py-2 text-3xl font-bold ">More about {name}</h2>
            <p className="text-base">
              <span className="text-xl font-bold">Mr. Egg,</span> {introduction}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
