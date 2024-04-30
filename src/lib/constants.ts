import client1 from '../../public/client1.png';
import client2 from '../../public/client2.png';
import client3 from '../../public/client3.png';
import client4 from '../../public/client4.png';
import client5 from '../../public/client5.png';

export const CLIENTS = [
  { alt: 'client1', logo: client1 },
  { alt: 'client2', logo: client2 },
  { alt: 'client3', logo: client3 },
  { alt: 'client4', logo: client4 },
  { alt: 'client5', logo: client5 },
];

export const USERS = [
  {
    name: 'Alice',
    message:
      'Boardy has been a game-changer for our team. With its reliable end-to-end testing, we catch bugs early, leading to faster development cycles and improved collaboration.',
    job: 'Software Engineer'
  },
  {
    name: 'Bob',
    message:
      "I used to spend hours debugging frontend issues, but Boardy simplified everything. Now, I'm more productive, and my colleagues can trust our code thanks to Boardy.",
    job: 'Frontend Developer'
  },
  {
    name: 'Charlie',
    message:
      "Boardy has transformed the way we work. Our QA and development teams are on the same page, and our productivity has skyrocketed. It's a must-have tool.",
    job: 'QA Tester'
  },
  {
    name: 'David',
    message:
      'I was skeptical at first, but Boardy exceeded my expectations. Our project timelines have improved, and collaboration between teams is seamless.',
    job: 'Project Manager'
  },
  {
    name: 'Ella',
    message:
      "Boardy made writing and running tests a breeze. Our team's productivity has never been higher, and we're delivering more reliable software.",
    job: 'DevOps Engineer'
  },
  {
    name: 'Frank',
    message:
      "Thanks to Boardy, we've eliminated testing bottlenecks. Our developers and testers collaborate effortlessly, resulting in quicker releases.",
    job: 'QA Tester'
  },
  {
    name: 'Grace',
    message:
      'Boardy has improved our development process significantly. We now have more time for innovation, and our products are of higher quality.',
    job: 'Product Manager'
  },
  {
    name: 'Hank',
    message:
      "Boardy's user-friendly interface made it easy for our non-technical team members to contribute to testing. Our workflow is much more efficient now.",
    job: 'Technical Writer'
  },
  {
    name: 'Ivy',
    message:
      "Our team's collaboration improved immensely with Boardy. We catch issues early, leading to less friction and quicker feature deployments.",
    job: 'Scrum Master'
  },
  {
    name: 'Jack',
    message:
      "Boardy's robust testing capabilities have elevated our development standards. We work more harmoniously, and our releases are more reliable.",
    job: 'Backend Developer'
  },
  {
    name: 'Katherine',
    message:
      "Boardy is a lifesaver for our cross-functional teams. We're more productive, and there's a shared sense of responsibility for product quality.",
    job: 'Product Manager'
  },
  {
    name: 'Liam',
    message:
      "Boardy has helped us maintain high standards of quality. Our team's collaboration has improved, resulting in faster development cycles.",
    job: 'System Administrator'
  },
  {
    name: 'Mia',
    message:
      "Boardy is a powerful tool that improved our productivity and collaboration. It's now an integral part of our development process.",
    job: 'Software Engineer'
  },
  {
    name: 'Nathan',
    message:
      "Boardy's user-friendly interface and detailed reporting have made testing a breeze. Our team's productivity is at an all-time high.",
    job: 'Data Analyst'
  },
  {
    name: 'Olivia',
    message:
      "We saw immediate benefits in terms of productivity and collaboration after adopting Boardy. It's an essential tool for our development workflow.",
    job: 'UI/UX Designer'
  },
  {
    name: 'Paul',
    message:
      "Boardy has streamlined our testing process and brought our teams closer. We're more efficient and deliver better results.",
    job: 'Business Analyst'
  },
  {
    name: 'Quinn',
    message:
      'Boardy has been a game-changer for us. Our productivity and collaboration have improved significantly, leading to better software.',
    job: 'Cloud Architect'
  },
  {
    name: 'Rachel',
    message:
      'Thanks to Boardy, our testing process is now a seamless part of our development cycle. Our teams collaborate effortlessly.',
    job: 'Network Engineer'
  },
  {
    name: 'Sam',
    message:
      'Boardy is a fantastic tool that has revolutionized our workflow. Our productivity and collaboration have reached new heights.',
    job: 'Mobile App Developer'
  }
];


export const PRICING_CARDS = [
  {
    planType: 'Free Plan',
    price: '0',
    description: 'Limited block trials  for teams',
    highlightFeature: '',
    freatures: [
      'Unlimited blocks for teams',
      'Unlimited file uploads',
      '30 day page history',
      'Invite 2 guests',
    ],
  },
  {
    planType: 'Pro Plan',
    price: '12.99',
    description: 'Billed annually. $17 billed monthly',
    highlightFeature: 'Everything in free +',
    freatures: [
      'Unlimited blocks for teams',
      'Unlimited file uploads',
      '1 year day page history',
      'Invite 10 guests',
    ],
  },
];

export const PRICING_PLANS = { proplan: 'Pro Plan', freeplan: 'Free Plan' };

export const MAX_FOLDERS_FREE_PLAN = 3;