import qs from 'qs';
import axios from 'axios';
async function getCopartSuggestions() {
  const url = "https://www.copart.com/public/data/lots/suggest";

  const data = qs.stringify({
    q: "aud"
  });

  try {
    const response = await axios.post(url, data, {
      headers: {
        
        
        "Cookie": `anonymousCrmId=cca4dc72-15fa-42d5-b013-20b916e7677b; userCategory=RPU; _fbp=fb.1.1755061324636.172692469115466084; OptanonAlertBoxClosed=2025-08-13T05:06:38.565Z; _ga=GA1.1.1044314117.1755061599; OAID=01000111010001000101000001010010; _gcl_au=1.1.845843110.1764234082; g2usersessionid_b=62061772b3b1a4140d2075df8c71d049; userLang=en; timezone=Asia%2FCalcutta; usersessionid=8b7a8968a7dfa001c484e404e5df0266; g2app.search-table-rows=20; _clck=21tx1y%5E2%5Eg1j%5E1%5E2051; g2usersessionid=075e793ef756232a864a52588a2d34bd; G2JSESSIONID=8EB7F4E554891A711F01500BA48D5F43-n1; visid_incap_242093=COWcOxCkQrmu7BdhqxbMhpECMGkAAAAAQUIPAAAAAAD8QupeaspxitmBbf5btKyv; nlbi_242093=MBYPf9xVUyCkD/SPie/jegAAAACWcbCDm3MGr0JgrFzQOdbu; incap_ses_972_242093=+TwGGMRAYk2oIjRW8zx9DZICMGkAAAAAbC6a+LsgRAJS1d8DCFnYdA==; OptanonConsent=isGpcEnabled=0&datestamp=Wed+Dec+03+2025+14%3A57%3A50+GMT%2B0530+(India+Standard+Time)&version=202510.2.0&browserGpcFlag=0&isIABGlobal=false&hosts=&consentId=dc39141d-a223-4233-bf44-28d2eb9a7f28&interactionCount=2&isAnonUser=1&landingPath=NotLandingPage&groups=C0001%3A1%2CC0002%3A1%2CC0003%3A1%2CC0004%3A1%2CC0005%3A1&AwaitingReconsent=false&intType=1&geolocation=IN%3BMH; copartTimezonePref=%7B%22displayStr%22%3A%22GMT%2B5%3A30%22%2C%22offset%22%3A5.5%2C%22dst%22%3Afalse%2C%22windowsTz%22%3A%22Asia%2FCalcutta%22%7D; nlbi_242093_2147483392=J6IjOnsQzT5itiuRie/jegAAAACXi4dFlpgS3Qqt/XRYi6s1; reese84=3:0PEG/...; fs_lua=1.1764754070668; fs_uid=#o-76DP-eu1...`
      }
    });

    console.log(response.data);
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
  }
}
getCopartSuggestions();