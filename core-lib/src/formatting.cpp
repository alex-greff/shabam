#include "formatting.hpp"

#include <termcolor/termcolor.hpp>

namespace shabam {
namespace formatting {

std::ostream &normal_style(std::ostream &os) {
  os << termcolor::reset << termcolor::white;
  return os;
};

std::ostream &bold_style(std::ostream &os) {
  os << termcolor::reset << termcolor::bold << termcolor::white;
  return os;
};

std::ostream &dim_style(std::ostream &os) {
  os << termcolor::reset << termcolor::dark << termcolor::white;
  return os;
};

std::ostream &warning_style(std::ostream &os) {
  os << termcolor::reset << termcolor::dark << termcolor::yellow;
  return os;
};

std::ostream &bullet(std::ostream &os) {
  os << termcolor::reset << termcolor::bold << termcolor::cyan << "•"
     << termcolor::reset;
  return os;
};

std::ostream &reset_style(std::ostream &os) {
  os << termcolor::reset;
  return os;
}

std::ostream &caret(std::ostream &os) {
  os << termcolor::reset << termcolor::bold << termcolor::red << "›"
     << termcolor::reset;
  return os;
};

} // namespace formatting
} // namespace shabam