import { forwardRef } from 'react';
import { FiArrowRight } from 'react-icons/fi';
import './Button.css';

/**
 * Button primitive.
 *
 * Props:
 *  - variant: 'primary' (default) | 'solid' | 'ghost' | 'link'
 *  - size: 'sm' | 'md' (default) | 'lg'
 *  - arrow: boolean — render a trailing arrow that slides right on hover
 *  - as: string — render as different element (e.g. 'a', Link). Default 'button'.
 *  - children: button label
 *
 * All other props are forwarded to the underlying element.
 */
const Button = forwardRef(function Button(
  {
    variant = 'primary',
    size = 'md',
    arrow = false,
    as: Tag = 'button',
    type,
    children,
    className = '',
    ...rest
  },
  ref
) {
  const classes = [
    'btn',
    `btn--${variant}`,
    `btn--${size}`,
    arrow ? 'btn-arrow' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // Only a native <button> defaults to type="button"; pass-through otherwise.
  const buttonType = Tag === 'button' ? type ?? 'button' : type;

  return (
    <Tag ref={ref} className={classes} type={buttonType} {...rest}>
      <span>{children}</span>
      {arrow && <FiArrowRight className="arrow" aria-hidden="true" />}
    </Tag>
  );
});

export default Button;
