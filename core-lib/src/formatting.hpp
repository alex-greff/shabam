#pragma once

#include <sstream>

namespace shabam {
namespace formatting {

std::ostream &normal_style(std::ostream &os);
std::ostream &bold_style(std::ostream &os);
std::ostream &dim_style(std::ostream &os);
std::ostream &warning_style(std::ostream &os);
std::ostream &reset_style(std::ostream &os);

std::ostream &bullet(std::ostream &os);
std::ostream &caret(std::ostream &os);

} // namespace formatting
} // namespace shabam