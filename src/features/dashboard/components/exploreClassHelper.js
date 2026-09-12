import {
  LaptopIllustration,
  BrainIllustration,
  ShieldIllustration,
  ChartIllustration,
  GenericIllustration,
} from "./ExploreClassIllustration.jsx";

export function getIllustrationForSubject(subject = '', title = '') {
  const text = (subject + ' ' + title).toLowerCase();

  if (
    text.includes('web') ||
    text.includes('front') ||
    text.includes('back') ||
    text.includes('code') ||
    text.includes('program') ||
    text.includes('react') ||
    text.includes('dev') ||
    text.includes('software')
  ) {
    return {
      Illustration: LaptopIllustration,
      glyph: 'code',
      theme: 'orange',
    };
  }

  if (
    text.includes('ai') ||
    text.includes('machine') ||
    text.includes('learning') ||
    text.includes('intelligence') ||
    text.includes('neural') ||
    text.includes('robot')
  ) {
    return {
      Illustration: BrainIllustration,
      glyph: 'brain',
      theme: 'emerald',
    };
  }

  if (
    text.includes('cyber') ||
    text.includes('security') ||
    text.includes('shield') ||
    text.includes('hack') ||
    text.includes('network') ||
    text.includes('cloud') ||
    text.includes('defense')
  ) {
    return {
      Illustration: ShieldIllustration,
      glyph: 'shield',
      theme: 'purple',
    };
  }

  if (
    text.includes('data') ||
    text.includes('analytics') ||
    text.includes('science') ||
    text.includes('stat') ||
    text.includes('chart') ||
    text.includes('math') ||
    text.includes('business')
  ) {
    return {
      Illustration: ChartIllustration,
      glyph: 'chart',
      theme: 'blue',
    };
  }

  return {
    Illustration: GenericIllustration || LaptopIllustration,
    glyph: 'code',
    theme: 'orange',
  };
}
