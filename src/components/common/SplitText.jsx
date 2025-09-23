import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText as GSAPSplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, GSAPSplitText);

const SplitText = ({
  text,
  className = '',
  delay = 100,
  duration = 0.6,
  ease = 'power3.out',
  splitType = 'chars',
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = '-100px',
  textAlign = 'center',
  tag = 'p',
  onLetterAnimationComplete
}) => {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current || !text) return;

    const el = ref.current;

    // Wait for fonts to be loaded before initializing SplitText
    const initSplitText = () => {
      // Clean up previous instance
      if (el._splitInstance) {
        try {
          el._splitInstance.revert();
        } catch (_) {
          /* noop */
        }
        el._splitInstance = null;
      }

      const startPct = (1 - threshold) * 100;
      const marginMatch = /^(-?\d+(?:\.\d+)?)(px|em|rem|%)?$/.exec(rootMargin);
      const marginValue = marginMatch ? parseFloat(marginMatch[1]) : 0;
      const marginUnit = marginMatch ? marginMatch[2] || 'px' : 'px';
      const sign =
        marginValue === 0
          ? ''
          : marginValue < 0
            ? `-=${Math.abs(marginValue)}${marginUnit}`
            : `+=${marginValue}${marginUnit}`;
      const start = `top ${startPct}%${sign}`;

      let targets;
      const assignTargets = self => {
        if (splitType.includes('chars') && self.chars.length) targets = self.chars;
        if (!targets && splitType.includes('words') && self.words.length) targets = self.words;
        if (!targets && splitType.includes('lines') && self.lines.length) targets = self.lines;
        if (!targets) targets = self.chars || self.words || self.lines;
      };

      try {
        const splitInstance = new GSAPSplitText(el, {
          type: splitType,
          linesClass: 'split-line',
          wordsClass: 'split-word',
          charsClass: 'split-char'
        });

        assignTargets(splitInstance);

        const tween = gsap.fromTo(
          targets,
          { ...from },
          {
            ...to,
            duration,
            ease,
            stagger: delay / 1000,
            scrollTrigger: {
              trigger: el,
              start,
              once: true
            },
            onComplete: () => {
              onLetterAnimationComplete?.();
            }
          }
        );

        el._splitInstance = splitInstance;
      } catch (error) {
        console.warn('SplitText initialization failed:', error);
      }
    };

    // Check if fonts are loaded, if not wait for them
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        // Small additional delay to ensure fonts are fully rendered
        setTimeout(initSplitText, 100);
      });
    } else {
      // Fallback for browsers that don't support document.fonts
      setTimeout(initSplitText, 500);
    }

    return () => {
      ScrollTrigger.getAll().forEach(st => {
        if (st.trigger === el) st.kill();
      });
      try {
        if (el._splitInstance) el._splitInstance.revert();
      } catch (_) {
        /* noop */
      }
    };
  }, [
    text,
    delay,
    duration,
    ease,
    splitType,
    from.opacity,
    from.y,
    to.opacity,
    to.y,
    threshold,
    rootMargin,
    onLetterAnimationComplete
  ]);

  const renderTag = () => {
    const style = {
      textAlign,
      overflow: 'hidden'
    };
    const classes = `split-parent ${className}`;
    switch (tag) {
      case 'h1':
        return (
          <h1 ref={ref} style={style} className={classes}>
            {text}
          </h1>
        );
      case 'h2':
        return (
          <h2 ref={ref} style={style} className={classes}>
            {text}
          </h2>
        );
      case 'h3':
        return (
          <h3 ref={ref} style={style} className={classes}>
            {text}
          </h3>
        );
      case 'h4':
        return (
          <h4 ref={ref} style={style} className={classes}>
            {text}
          </h4>
        );
      case 'h5':
        return (
          <h5 ref={ref} style={style} className={classes}>
            {text}
          </h5>
        );
      case 'h6':
        return (
          <h6 ref={ref} style={style} className={classes}>
            {text}
          </h6>
        );
      default:
        return (
          <p ref={ref} style={style} className={classes}>
            {text}
          </p>
        );
    }
  };
  return renderTag();
};

export default SplitText;